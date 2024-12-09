import { behavior } from './behavior'

export { behavior, computed, watch } from './behavior'

type FilterUnknownType<T> = WechatMiniprogram.Component.FilterUnknownType<T>

type AllDataAndProperties<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
> = FilterUnknownType<TData> &
  WechatMiniprogram.Component.MixinData<TBehavior> &
  WechatMiniprogram.Component.MixinProperties<TBehavior> &
  WechatMiniprogram.Component.PropertyOptionToData<FilterUnknownType<TProperty>>


type ComputedInstance<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TComputed extends Record<string, (data: AllDataAndProperties<TData, TProperty, TBehavior>) => any>,
  TCustomProperty extends WechatMiniprogram.IAnyObject = Record<string, never>,
> = WechatMiniprogram.Component.Instance<
  TData & { [k in keyof TComputed]: ReturnType<TComputed[k]> },
  TProperty,
  TMethod,
  TBehavior,
  TCustomProperty
>

type ComputedOptions<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TWatch extends Record<string, (...args: any[]) => void>,
  TComputed extends Record<
    string,
    (data: AllDataAndProperties<TData, TProperty, TBehavior>) => any
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.Behavior<TBehavior>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    watch?: TWatch
    computed?: TComputed
    template?: string
  }) &
  ThisType<ComputedInstance<TData, TProperty, TMethod, TBehavior, TComputed, TCustomInstanceProperty>>

export function ComponentWithComputed<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TWatch extends Record<string, (...args: any[]) => void>,
  TComputed extends Record<
    string,
    (data: AllDataAndProperties<TData, TProperty, TBehavior>) => any
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(
  options: ComputedOptions<TData, TProperty, TMethod, TBehavior, TWatch, TComputed, TCustomInstanceProperty>,
): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = [] as any
  }
  (options.behaviors as any).unshift(behavior)
  return Component(options)
}

export function BehaviorWithComputed<
  TData extends WechatMiniprogram.Behavior.DataOption,
  TProperty extends WechatMiniprogram.Behavior.PropertyOption,
  TMethod extends WechatMiniprogram.Behavior.MethodOption,
  TBehavior extends WechatMiniprogram.Component.BehaviorOption,
  TWatch extends Record<string, (...args: any[]) => void>,
  TComputed extends Record<
    string,
    (data: AllDataAndProperties<TData, TProperty, TBehavior>) => any
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(
  options: ComputedOptions<TData, TProperty, TMethod, TBehavior, TWatch, TComputed, TCustomInstanceProperty>,
): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = [] as any
  }
  options.behaviors.unshift(behavior)
  return Behavior(options)
}

// data tracer mode
export enum DataTracerMode {
  Auto,
  Proxy,
  DefineProperty,
}

let currentDataTracerMode = DataTracerMode.Auto

export const getCurrentDataTracerMode = () => {
  return currentDataTracerMode
}

export const setCurrentDataTracerMode = (mode: DataTracerMode) => {
  currentDataTracerMode = mode
}
