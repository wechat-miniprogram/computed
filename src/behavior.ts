/* eslint-disable @typescript-eslint/ban-types */
import rfdc from "rfdc";
import deepEqual from "fast-deep-equal";
import * as dataPath from "./data-path";
import * as dataTracer from "./data-tracer";

const deepClone = rfdc({ proto: true });

interface BehaviorExtend {
  _computedWatchInfo: {
    computedRelatedPathValues: Record<string, any>;
    watchCurVal: Record<string, any>;
  };
  __computedUpdaters__: Array<() => boolean>;
  __definition__(): any;
  _initComputedWatchInfo?: boolean;
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
      const { computedDef = {} } = this.__definition__();
      if (!this.data) {
        this.data = {};
      }
      // const setDataObj = {}

      // handling computed
      // 1. push to initFuncs
      // 2. push to computedUpdaters
      Object.keys(computedDef).forEach((targetField) => {
        const updateMethod = computedDef[targetField];
        const relatedPathValuesOnDef = [];
        // const initData = { ...this.data }
        const val = updateMethod(
          dataTracer.create(this.data, relatedPathValuesOnDef)
        );

        const pathValues = relatedPathValuesOnDef.map(({ path }) => ({
          path,
          value: dataPath.getDataOnPath(this.data, path),
        }));

        this.data[targetField] = val;

        // const { path: targetPath } = dataPath.parseSingleDataPath(targetField)
        // dataPath.setDataOnPath(this.data, targetPath, dataTracer.unwrap(val))
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
        this.__computedUpdaters__.push(updateValueAndRelatedPaths);
      });

      this.setData(this.data);
    },
    created(this: BehaviorExtend) {
      const { watchDef = {} } = this.__definition__();
      // initialize status, executed on created
      const initFuncs: Array<(...args: any[]) => void> = [];
      if (this._initComputedWatchInfo) {
        throw new Error(
          "Please do not use this behavior more than once in a single component"
        );
      }
      this.__computedUpdaters__ = [];

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
          computedRelatedPathValues: {},
          watchCurVal: {},
        };
        initFuncs.forEach((func) => func.call(this));
        this._initComputedWatchInfo = true;
      }
    },
  },

  definitionFilter(defFields: any & BehaviorExtend) {
    const computedDef = defFields.computed;
    const watchDef = defFields.watch;
    const observersItems: ObserversItem[] = [];

    if (!defFields.methods) defFields.methods = {};
    defFields.methods.__definition__ = () => ({
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
            changed = false;
            // eslint-disable-next-line no-loop-func
            this.__computedUpdaters__.forEach((func) => {
              if (func.call(this)) changed = true;
            });
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
            // get curVal
            const originalCurValWithOptions = paths.map(({ path, options }) => {
              const val = dataPath.getDataOnPath(this.data, path);
              // if (path.includes('categories')) {
              //     console.log(path, ', val:', val, ', ', JSON.stringify(this.data))
              // }
              return { val, options };
            });
            const curVal = originalCurValWithOptions.map(({ val, options }) =>
              options.deepCmp ? deepClone(val) : val
            );
            // update
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
  },
});
