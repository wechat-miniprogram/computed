/* eslint-disable @typescript-eslint/ban-types */
import rfdc from "rfdc";
import deepEqual from "fast-deep-equal";
import * as dataPath from "./data-path";
import * as dataTracer from "./data-tracer";

const deepClone = rfdc({ proto: true });

interface BehaviorExtend {
  _computedWatchInfo: {
    computedUpdaters: Array<() => boolean>;
    computedRelatedPathValues: Record<string, any>;
    watchCurVal: Record<string, any>;
  };
  _computedWatchDefinition(): any;
  // original
  data: Record<string, any>;
  setData(d: Record<string, any>): void;
}

interface ObserversItem {
  fields: string;
  observer(): void;
}

export const behavior = Behavior({
  lifetimes: {
    attached(this: BehaviorExtend) {
      const { computedDef = {} } = this._computedWatchDefinition();
      if (!this.data) {
        this.data = {};
      }
      
      // handling computed
      // 1. push to initFuncs
      // 2. push to computedUpdaters
      const setDataObj: Record<string, any> = {}
      Object.keys(computedDef).forEach((targetField) => {
        const updateMethod = computedDef[targetField];
        const relatedPathValuesOnDef = [];
        const val = updateMethod(
          dataTracer.create(this.data, relatedPathValuesOnDef)
        );

        const pathValues = relatedPathValuesOnDef.map(({ path }) => ({
          path,
          value: dataPath.getDataOnPath(this.data, path),
        }));

        setDataObj[targetField] = val;

        this._computedWatchInfo.computedRelatedPathValues[
          targetField
        ] = pathValues;

        // will be invoked when setData is called
        const updateValueAndRelatedPaths = () => {
          const oldPathValues = this._computedWatchInfo
            .computedRelatedPathValues[targetField];
          let needUpdate = false;
          // check whether its dependency updated
          for (let i = 0; i < oldPathValues.length; i++) {
            const { path, value: oldVal } = oldPathValues[i];
            const curVal = dataPath.getDataOnPath(this.data, path);
            if (oldVal !== curVal) {
              needUpdate = true;
              break;
            }
          }
          if (!needUpdate) return false;

          const relatedPathValues = [];
          const val = updateMethod(
            dataTracer.create(this.data, relatedPathValues)
          );
          this.setData({
            [targetField]: val,
          });
          this._computedWatchInfo.computedRelatedPathValues[
            targetField
          ] = relatedPathValues;
          return true;
        };
        this._computedWatchInfo.computedUpdaters.push(updateValueAndRelatedPaths);
      });

      this.setData(setDataObj);
    },
    created(this: BehaviorExtend) {
      const { watchDef = {} } = this._computedWatchDefinition();
      // initialize status, executed on created
      const initFuncs: Array<(...args: any[]) => void> = [];
      if (this._computedWatchInfo) {
        throw new Error(
          "Please do not use this behavior more than once in a single component"
        );
      }

      // handling watch
      // 1. push to initFuncs
      Object.keys(watchDef).forEach((watchPath) => {
        const paths = dataPath.parseMultiDataPaths(watchPath);
        // record the original value of watch targets
        initFuncs.push(() => {
          const curVal = paths.map(({ path, options }) => {
            const val = dataPath.getDataOnPath(this.data, path);
            return options.deepCmp ? deepClone(val) : val;
          });
          this._computedWatchInfo.watchCurVal[watchPath] = curVal;
        });
      });

      // init
      if (!this._computedWatchInfo) {
        this._computedWatchInfo = {
          computedUpdaters: [],
          computedRelatedPathValues: {},
          watchCurVal: {},
        };
        initFuncs.forEach((func) => func.call(this));
      }
    },
  },

  definitionFilter(defFields: any & BehaviorExtend) {
    const computedDef = defFields.computed;
    const watchDef = defFields.watch;
    const observersItems: ObserversItem[] = [];

    if (!defFields.methods) defFields.methods = {};
    defFields.methods._computedWatchDefinition = () => ({
      computedDef: defFields.computed,
      watchDef: defFields.watch,
    });

    if (computedDef) {
      observersItems.push({
        fields: "**",
        observer(this: BehaviorExtend) {
          if (!this._computedWatchInfo) return;

          let changed: boolean;
          do {
            changed = this._computedWatchInfo.computedUpdaters.some((func) => func.call(this));
          } while (changed);
        },
      });
    }

    if (watchDef) {
      Object.keys(watchDef).forEach((watchPath) => {
        const paths = dataPath.parseMultiDataPaths(watchPath);
        observersItems.push({
          fields: watchPath,
          observer(this: BehaviorExtend) {
            if (!this._computedWatchInfo) return;
            const oldVal = this._computedWatchInfo.watchCurVal[watchPath];

            // get new watching field value
            const originalCurValWithOptions = paths.map(({ path, options }) => {
              const val = dataPath.getDataOnPath(this.data, path);
              return { val, options };
            });
            const curVal = originalCurValWithOptions.map(({ val, options }) =>
              options.deepCmp ? deepClone(val) : val
            );
            this._computedWatchInfo.watchCurVal[watchPath] = curVal;

            // compare
            let changed = false;
            for (let i = 0; i < curVal.length; i++) {
              const options = paths[i].options;
              const deepCmp = options.deepCmp;
              if (
                deepCmp
                  ? !deepEqual(oldVal[i], curVal[i])
                  : oldVal[i] !== curVal[i]
              ) {
                changed = true;
                break;
              }
            }

            // if changed, update
            if (changed) {
              watchDef[watchPath].apply(
                this,
                originalCurValWithOptions.map(({ val }) => val)
              );
            }
          },
        });
      });
    }

    if (typeof defFields.observers !== "object") {
      defFields.observers = {};
    }
    if (defFields.observers instanceof Array) {
      defFields.observers.push(...observersItems)
    } else {
      observersItems.forEach((item) => {
        // defFields.observers[item.fields] = item.observer
        const f = defFields.observers[item.fields];
        if (!f) {
          defFields.observers[item.fields] = item.observer;
        } else {
          defFields.observers[item.fields] = function () {
            item.observer.call(this);
            f.call(this);
          };
        }
      });
    }
  },
});
