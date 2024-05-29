import rfdc from 'rfdc'
import deepEqual from 'fast-deep-equal'
import * as dataPath from './data-path'
import * as dataTracer from './data-tracer'
import type { DataPathWithOptions } from './data-path'
import type * as adapter from 'glass-easel-miniprogram-adapter'

const deepClone = rfdc({ proto: true })

interface BehaviorData {
  _computedWatchInit: ComputedWatchInitStatus
  [k: string]: any
}

interface BehaviorExtend {
  // original
  data: BehaviorData
  setData(d: Record<string, any>): void
  _computedWatchInfo: Record<string, ComputedWatchInfo>
}

interface ObserversItem {
  fields: string
  observer(): void
}

interface ComputedWatchInfo {
  computedUpdaters: Array<(...args: unknown[]) => boolean>
  computedRelatedPathValues: Array<Array<dataTracer.RelatedPathValue>>
  watchCurVal: Array<unknown>
  _triggerFromComputedAttached: Record<string, boolean>
}

enum ComputedWatchInitStatus {
  CREATED,
  ATTACHED,
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

class ComputedBuilder {
  observersItems: ObserversItem[] = []
  private computedWatchDefId = computedWatchDefIdInc++
  private computedList: Array<[string, (data: Record<string, unknown>) => unknown]> = []
  private watchList: Array<DataPathWithOptions[]> = []

  constructor() {
    const computedWatchDefId = this.computedWatchDefId
    const computedList = this.computedList
    const watchList = this.watchList
    this.observersItems.push({
      fields: '_computedWatchInit',
      observer(this: BehaviorExtend) {
        const status = this.data._computedWatchInit
        if (status === ComputedWatchInitStatus.CREATED) {
          // init data fields
          const computedWatchInfo = {
            computedUpdaters: [],
            computedRelatedPathValues: new Array(computedList.length),
            watchCurVal: new Array(watchList.length),
            _triggerFromComputedAttached: Object.create(null),
          }
          if (!this._computedWatchInfo) this._computedWatchInfo = {}
          this._computedWatchInfo[computedWatchDefId] = computedWatchInfo
          // handling watch
          // 1. push to initFuncs
          watchList.forEach((paths, index) => {
            // record the original value of watch targets
            const curVal = paths.map(({ path, options }) => {
              const val = dataPath.getDataOnPath(this.data, path)
              return options.deepCmp ? deepClone(val) : val
            })
            computedWatchInfo.watchCurVal[index] = curVal
          })
        } else if (status === ComputedWatchInitStatus.ATTACHED) {
          // handling computed
          // 1. push to initFuncs
          // 2. push to computedUpdaters
          const computedWatchInfo = this._computedWatchInfo[computedWatchDefId]
          computedList.forEach(([targetField, updateMethod], index) => {
            const relatedPathValuesOnDef = [] as Array<dataTracer.RelatedPathValue>
            const val = updateMethod(dataTracer.create(this.data, relatedPathValuesOnDef))
            // here we can do small setDatas
            // because observer handlers will force grouping small setDatas together
            this.setData({
              [targetField]: dataTracer.unwrap(val),
            })
            computedWatchInfo._triggerFromComputedAttached[targetField] = true
            computedWatchInfo.computedRelatedPathValues[index] = relatedPathValuesOnDef

            // will be invoked when setData is called
            const updateValueAndRelatedPaths = () => {
              const oldPathValues = computedWatchInfo.computedRelatedPathValues[index]
              let needUpdate = false
              // check whether its dependency updated
              for (let i = 0; i < oldPathValues.length; i++) {
                const item = oldPathValues[i]
                if (item.kind === 'keys') {
                  const { path, keys: oldKeys } = item
                  const curVal = dataPath.getDataOnPath(this.data, path)
                  const keys = Object.keys(curVal).sort()
                  if (keys.length !== oldKeys.length) {
                    needUpdate = true
                    break
                  }
                  for (let j = 0; j < keys.length; j += 1) {
                    if (keys[j] !== oldKeys[j]) {
                      needUpdate = true
                      break
                    }
                  }
                } else {
                  const { path, value: oldVal } = item
                  const curVal = dataPath.getDataOnPath(this.data, path)
                  if (!equal(oldVal, curVal)) {
                    needUpdate = true
                    break
                  }
                }
              }
              if (!needUpdate) return false

              const relatedPathValues = [] as Array<dataTracer.RelatedPathValue>
              const val = updateMethod(dataTracer.create(this.data, relatedPathValues))
              this.setData({
                [targetField]: dataTracer.unwrap(val),
              })
              computedWatchInfo.computedRelatedPathValues[index] = relatedPathValues
              return true
            }
            computedWatchInfo.computedUpdaters.push(updateValueAndRelatedPaths)
          })
        }
      },
    })
  }

  addComputed(targetField: string, updateMethod: (data: Record<string, unknown>) => unknown) {
    this.computedList.push([targetField, updateMethod])
    if (this.computedList.length !== 1) return
    const computedWatchDefId = this.computedWatchDefId
    this.observersItems.push({
      fields: '**',
      observer(this: BehaviorExtend) {
        if (!this._computedWatchInfo) return
        const computedWatchInfo = this._computedWatchInfo[computedWatchDefId]
        if (!computedWatchInfo) return

        let changed: boolean
        do {
          try {
            changed = computedWatchInfo.computedUpdaters.some((func) => func.call(this))
          } catch (err) {
            console.error(err.stack)
            break
          }
        } while (changed)
      },
    })
  }

  addWatch(watchPath: string, listener: (args: any) => void) {
    const paths = dataPath.parseMultiDataPaths(watchPath)
    const index = this.watchList.length
    this.watchList.push(paths)
    const computedWatchDefId = this.computedWatchDefId
    this.observersItems.push({
      fields: watchPath,
      observer(this: BehaviorExtend) {
        if (!this._computedWatchInfo) return
        const computedWatchInfo = this._computedWatchInfo[computedWatchDefId]
        if (!computedWatchInfo) return
        // (issue #58) ignore watch func when trigger by computed attached
        if (Object.keys(computedWatchInfo._triggerFromComputedAttached).length) {
          const pathsMap: Record<string, boolean> = {}
          paths.forEach((path) => (pathsMap[path.path[0]] = true))
          for (const computedVal in computedWatchInfo._triggerFromComputedAttached) {
            if (computedWatchInfo._triggerFromComputedAttached[computedVal]) {
              if (
                pathsMap[computedVal] &&
                computedWatchInfo._triggerFromComputedAttached[computedVal]
              ) {
                computedWatchInfo._triggerFromComputedAttached[computedVal] = false
                return
              }
            }
          }
        }
        const oldVal = computedWatchInfo.watchCurVal[index]

        // get new watching field value
        const originalCurValWithOptions = paths.map(({ path, options }) => {
          const val = dataPath.getDataOnPath(this.data, path)
          return { val, options }
        })
        const curVal = originalCurValWithOptions.map(({ val, options }) =>
          options.deepCmp ? deepClone(val) : val,
        )
        computedWatchInfo.watchCurVal[index] = curVal

        // compare
        let changed = false
        for (let i = 0; i < curVal.length; i++) {
          const options = paths[i].options
          const deepCmp = options.deepCmp
          if (deepCmp ? !deepEqual(oldVal[i], curVal[i]) : !equal(oldVal[i], curVal[i])) {
            changed = true
            break
          }
        }

        // if changed, update
        if (changed) {
          listener.apply(
            this,
            originalCurValWithOptions.map(({ val }) => val),
          )
        }
      },
    })
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

    const builder = new ComputedBuilder()
    if (computedDef) {
      Object.keys(computedDef).forEach((targetField) => {
        const updateMethod = computedDef[targetField]
        builder.addComputed(targetField, updateMethod)
      })
    }
    if (watchDef) {
      Object.keys(watchDef).forEach((watchPath) => {
        const listener = watchDef[watchPath]
        builder.addWatch(watchPath, listener)
      })
    }
    const observersItems = builder.observersItems

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

const tryInitInCtx = (
  ctx: adapter.builder.BuilderContext<any, any, any> & { _computedWatchInit?: boolean },
) => {
  if (ctx._computedWatchInit) return
  ctx._computedWatchInit = true
  const { lifetime, setData } = ctx
  lifetime('attached', function () {
    setData({
      _computedWatchInit: ComputedWatchInitStatus.ATTACHED,
    })
  })
  lifetime('created', function () {
    setData({
      _computedWatchInit: ComputedWatchInitStatus.CREATED,
    })
  })
}

export function computed<
  TComputedDefinition1 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>,
    ) => any
  },
  TPrevData extends adapter.glassEasel.typeUtils.DataList,
  TProperty extends adapter.glassEasel.typeUtils.PropertyList,
>(
  ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>,
  computedDefinition1: TComputedDefinition1,
): adapter.glassEasel.typeUtils.DataWithPropertyValues<
  TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> },
  TProperty
>
export function computed<
  TComputedDefinition1 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>,
    ) => any
  },
  TComputedDefinition2 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<
        TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> },
        TProperty
      >,
    ) => any
  },
  TPrevData extends adapter.glassEasel.typeUtils.DataList,
  TProperty extends adapter.glassEasel.typeUtils.PropertyList,
>(
  ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>,
  computedDefinition1: TComputedDefinition1,
  computedDefinition2: TComputedDefinition2,
): adapter.glassEasel.typeUtils.DataWithPropertyValues<
  TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> } & {
    [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>
  },
  TProperty
>
export function computed<
  TComputedDefinition1 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>,
    ) => any
  },
  TComputedDefinition2 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<
        TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> },
        TProperty
      >,
    ) => any
  },
  TComputedDefinition3 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<
        TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> } & {
          [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>
        },
        TProperty
      >,
    ) => any
  },
  TPrevData extends adapter.glassEasel.typeUtils.DataList,
  TProperty extends adapter.glassEasel.typeUtils.PropertyList,
>(
  ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>,
  computedDefinition1: TComputedDefinition1,
  computedDefinition2: TComputedDefinition2,
  computedDefinition3: TComputedDefinition3,
): adapter.glassEasel.typeUtils.DataWithPropertyValues<
  TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> } & {
    [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>
  } & { [k in keyof TComputedDefinition3]: ReturnType<TComputedDefinition3[k]> },
  TProperty
>
export function computed<
  TComputedDefinition1 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>,
    ) => any
  },
  TComputedDefinition2 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<
        TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> },
        TProperty
      >,
    ) => any
  },
  TComputedDefinition3 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<
        TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> } & {
          [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>
        },
        TProperty
      >,
    ) => any
  },
  TComputedDefinition4 extends {
    [k: string]: (
      data: adapter.glassEasel.typeUtils.DataWithPropertyValues<
        TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> } & {
          [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>
        } & { [k in keyof TComputedDefinition3]: ReturnType<TComputedDefinition3[k]> },
        TProperty
      >,
    ) => any
  },
  TPrevData extends adapter.glassEasel.typeUtils.DataList,
  TProperty extends adapter.glassEasel.typeUtils.PropertyList,
>(
  ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>,
  computedDefinition1: TComputedDefinition1,
  computedDefinition2: TComputedDefinition2,
  computedDefinition3: TComputedDefinition3,
  computedDefinition4: TComputedDefinition4,
): adapter.glassEasel.typeUtils.DataWithPropertyValues<
  TPrevData & { [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]> } & {
    [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>
  } & { [k in keyof TComputedDefinition3]: ReturnType<TComputedDefinition3[k]> } & {
    [k in keyof TComputedDefinition4]: ReturnType<TComputedDefinition4[k]>
  },
  TProperty
>
export function computed<
  TPrevData extends adapter.glassEasel.typeUtils.DataList,
  TProperty extends adapter.glassEasel.typeUtils.PropertyList,
>(
  ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>,
  computedDefinition1: any,
  computedDefinition2?: any,
  computedDefinition3?: any,
  computedDefinition4?: any,
): unknown {
  tryInitInCtx(ctx)
  const builder = new ComputedBuilder()
  Object.keys(computedDefinition1).forEach((targetField) => {
    const updateMethod = computedDefinition1[targetField]
    builder.addComputed(targetField, updateMethod)
  })
  if (computedDefinition2) {
    Object.keys(computedDefinition2).forEach((targetField) => {
      const updateMethod = computedDefinition2[targetField]
      builder.addComputed(targetField, updateMethod)
    })
  }
  if (computedDefinition3) {
    Object.keys(computedDefinition3).forEach((targetField) => {
      const updateMethod = computedDefinition3[targetField]
      builder.addComputed(targetField, updateMethod)
    })
  }
  if (computedDefinition4) {
    Object.keys(computedDefinition4).forEach((targetField) => {
      const updateMethod = computedDefinition4[targetField]
      builder.addComputed(targetField, updateMethod)
    })
  }
  builder.observersItems.forEach(({ fields, observer }) => {
    ctx.observer(fields as any, observer)
  })
  return ctx.data as any
}

export const watch = (
  ctx: adapter.builder.BuilderContext<any, any, any>,
  watchPath: string,
  listener: (...args: any[]) => void,
) => {
  tryInitInCtx(ctx)
  const builder = new ComputedBuilder()
  builder.addWatch(watchPath, listener)
  builder.observersItems.forEach(({ fields, observer }) => {
    ctx.observer(fields as any, observer)
  })
}
