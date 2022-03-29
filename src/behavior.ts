import rfdc from 'rfdc'
import deepEqual from 'fast-deep-equal'
import * as dataPath from './data-path'
import * as dataTracer from './data-tracer'
import type { IRelatedPathValue } from './data-tracer'

const deepClone = rfdc({ proto: true })

interface BehaviorData {
  '_computedWatchInit': ComputedWatchInitStatus;
  [k: string]: any;
}

interface BehaviorExtend {
  // original
  data: BehaviorData;
  setData(d: Record<string, any>): void;
  _computedWatchInfo: Record<string, ComputedWatchInfo>;
}

interface ObserversItem {
  fields: string;
  observer(): void;
}

interface ComputedWatchInfo {
  computedUpdaters: Array<(...args: unknown[]) => boolean>;
  computedRelatedPathValues: Record<string, Array<IRelatedPathValue>>;
  watchCurVal: Record<string, any>;
  _triggerFromComputedAttached: Record<string, boolean>;
}

enum ComputedWatchInitStatus {
  CREATED,
  ATTACHED
}

let computedWatchDefIdInc = 0

function equal(a: unknown, b: unknown) {
  if (a === b) {
    return true
  } else {
    // When a = b = NaN
    // NaN === NaN is false
    return a !== a && b !== b
  }
}

export const behavior = Behavior({
  lifetimes: {
    attached(this: BehaviorExtend) {
      this.setData({
        _computedWatchInit: ComputedWatchInitStatus.ATTACHED,
      })
    },
    created(this: BehaviorExtend) {
      this.setData({
        _computedWatchInit: ComputedWatchInitStatus.CREATED,
      })
    },
  },

  definitionFilter(defFields: any & BehaviorExtend) {
    const computedDef = defFields.computed
    const watchDef = defFields.watch
    const observersItems: ObserversItem[] = []
    const computedWatchDefId = computedWatchDefIdInc++
    observersItems.push({
      fields: '_computedWatchInit',
      observer(this: BehaviorExtend) {
        const status = this.data._computedWatchInit
        if (status === ComputedWatchInitStatus.CREATED) {
          // init data fields
          const computedWatchInfo = {
            computedUpdaters: [],
            computedRelatedPathValues: {},
            watchCurVal: {},
            _triggerFromComputedAttached: {},
          }
          if (!this._computedWatchInfo) this._computedWatchInfo = {}
          this._computedWatchInfo[computedWatchDefId] = computedWatchInfo
          // handling watch
          // 1. push to initFuncs
          if (watchDef) {
            Object.keys(watchDef).forEach((watchPath) => {
              const paths = dataPath.parseMultiDataPaths(watchPath)
              // record the original value of watch targets
              const curVal = paths.map(({ path, options }) => {
                const val = dataPath.getDataOnPath(this.data, path)
                return options.deepCmp ? deepClone(val) : val
              })
              computedWatchInfo.watchCurVal[watchPath] = curVal
            })
          }
        } else if (status === ComputedWatchInitStatus.ATTACHED) {
          // handling computed
          // 1. push to initFuncs
          // 2. push to computedUpdaters
          const computedWatchInfo = this._computedWatchInfo[computedWatchDefId]
          if (computedDef) {
            Object.keys(computedDef).forEach((targetField) => {
              const updateMethod = computedDef[targetField]
              const relatedPathValuesOnDef = []
              const val = updateMethod(
                dataTracer.create(this.data, relatedPathValuesOnDef),
              )
              const pathValues = relatedPathValuesOnDef.map(({ path }) => ({
                path,
                value: dataPath.getDataOnPath(this.data, path),
              }))
              // here we can do small setDatas
              // because observer handlers will force grouping small setDatas together
              this.setData({
                [targetField]: dataTracer.unwrap(val),
              })
              computedWatchInfo._triggerFromComputedAttached[targetField] = true
              computedWatchInfo.computedRelatedPathValues[targetField] =
                pathValues

              // will be invoked when setData is called
              const updateValueAndRelatedPaths = () => {
                const oldPathValues =
                  computedWatchInfo.computedRelatedPathValues[targetField]
                let needUpdate = false
                // check whether its dependency updated
                for (let i = 0; i < oldPathValues.length; i++) {
                  const { path, value: oldVal } = oldPathValues[i]
                  const curVal = dataPath.getDataOnPath(this.data, path)
                  if (!equal(oldVal, curVal)) {
                    needUpdate = true
                    break
                  }
                }
                if (!needUpdate) return false

                const relatedPathValues = []
                const val = updateMethod(
                  dataTracer.create(this.data, relatedPathValues),
                )
                this.setData({
                  [targetField]: dataTracer.unwrap(val),
                })
                const pathValues = relatedPathValues.map(({ path }) => ({
                  path,
                  value: dataPath.getDataOnPath(this.data, path),
                }))
                computedWatchInfo.computedRelatedPathValues[targetField] =
                  pathValues
                return true
              }
              computedWatchInfo.computedUpdaters.push(
                updateValueAndRelatedPaths,
              )
            })
          }
        }
      },
    })

    if (computedDef) {
      observersItems.push({
        fields: '**',
        observer(this: BehaviorExtend) {
          if (!this._computedWatchInfo) return
          const computedWatchInfo = this._computedWatchInfo[computedWatchDefId]
          if (!computedWatchInfo) return

          let changed: boolean
          do {
            changed = computedWatchInfo.computedUpdaters.some((func) =>
              func.call(this),
            )
          } while (changed)
        },
      })
    }

    if (watchDef) {
      Object.keys(watchDef).forEach((watchPath) => {
        const paths = dataPath.parseMultiDataPaths(watchPath)
        observersItems.push({
          fields: watchPath,
          observer(this: BehaviorExtend) {
            if (!this._computedWatchInfo) return
            const computedWatchInfo =
              this._computedWatchInfo[computedWatchDefId]
            if (!computedWatchInfo) return
            // (issue #58) ignore watch func when trigger by computed attached
            if (
              Object.keys(computedWatchInfo._triggerFromComputedAttached).length
            ) {
              const pathsMap: Record<string, boolean> = {}
              paths.forEach((path) => (pathsMap[path.path[0]] = true))
              for (const computedVal in computedWatchInfo._triggerFromComputedAttached) {
                if (
                  computedWatchInfo._triggerFromComputedAttached.hasOwnProperty(
                    computedVal,
                  )
                ) {
                  if (
                    pathsMap[computedVal] &&
                    computedWatchInfo._triggerFromComputedAttached[computedVal]
                  ) {
                    computedWatchInfo._triggerFromComputedAttached[
                      computedVal
                    ] = false
                    return
                  }
                }
              }
            }
            const oldVal = computedWatchInfo.watchCurVal[watchPath]

            // get new watching field value
            const originalCurValWithOptions = paths.map(({ path, options }) => {
              const val = dataPath.getDataOnPath(this.data, path)
              return { val, options }
            })
            const curVal = originalCurValWithOptions.map(({ val, options }) =>
              options.deepCmp ? deepClone(val) : val,
            )
            computedWatchInfo.watchCurVal[watchPath] = curVal

            // compare
            let changed = false
            for (let i = 0; i < curVal.length; i++) {
              const options = paths[i].options
              const deepCmp = options.deepCmp
              if (
                deepCmp
                  ? !deepEqual(oldVal[i], curVal[i])
                  : !equal(oldVal[i], curVal[i])
              ) {
                changed = true
                break
              }
            }

            // if changed, update
            if (changed) {
              watchDef[watchPath].apply(
                this,
                originalCurValWithOptions.map(({ val }) => val),
              )
            }
          },
        })
      })
    }

    if (typeof defFields.observers !== 'object') {
      defFields.observers = {}
    }

    if (Array.isArray(defFields.observers)) {
      defFields.observers.push(...observersItems)
    } else {
      observersItems.forEach((item) => {
        // defFields.observers[item.fields] = item.observer
        const f = defFields.observers[item.fields]
        if (!f) {
          defFields.observers[item.fields] = item.observer
        } else {
          defFields.observers[item.fields] = function () {
            item.observer.call(this)
            f.call(this)
          }
        }
      })
    }
  },
})
