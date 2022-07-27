import { behavior } from './behavior'

export { behavior } from './behavior'

type ComputedInstance<
  D extends WechatMiniprogram.Component.DataOption,
  P extends WechatMiniprogram.Component.PropertyOption,
  M extends WechatMiniprogram.Component.MethodOption,
  C extends Record<string, (data: D & { [K in keyof P]: any }) => any>,
  TCustomProperty extends WechatMiniprogram.IAnyObject = Record<string, never>,
> = WechatMiniprogram.Component.Instance<D, P, M, TCustomProperty> & {
  data: { [K in keyof C]: ReturnType<C[K]> } & { [K in keyof P]: any };
}

type ComputedOptions<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TWatch extends Record<string, (...args: any[]) => void>,
  TComputed extends Record<
    string,
    (data: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>) => any
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
> = (Partial<WechatMiniprogram.Component.Data<TData>> &
  Partial<WechatMiniprogram.Component.Property<TProperty>> &
  Partial<WechatMiniprogram.Component.Method<TMethod>> &
  Partial<WechatMiniprogram.Component.OtherOption> &
  Partial<WechatMiniprogram.Component.Lifetimes> & {
    watch?: TWatch;
    computed?: TComputed;
    template?: string;
  }) &
  ThisType<
    ComputedInstance<
      TData,
      TProperty,
      TMethod,
      TComputed,
      TCustomInstanceProperty
    >
  >

export function ComponentWithComputed<
  TData extends WechatMiniprogram.Component.DataOption,
  TProperty extends WechatMiniprogram.Component.PropertyOption,
  TMethod extends WechatMiniprogram.Component.MethodOption,
  TWatch extends Record<string, (...args: any[]) => void>,
  TComputed extends Record<
    string,
    (data: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>) => any
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(
  options: ComputedOptions<
    TData,
    TProperty,
    TMethod,
    TWatch,
    TComputed,
    TCustomInstanceProperty
  >,
): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = []
  }
  options.behaviors.unshift(behavior)
  return Component(options)
}

export function BehaviorWithComputed<
  TData extends WechatMiniprogram.Behavior.DataOption,
  TProperty extends WechatMiniprogram.Behavior.PropertyOption,
  TMethod extends WechatMiniprogram.Behavior.MethodOption,
  TWatch extends Record<string, (...args: any[]) => void>,
  TComputed extends Record<
    string,
    (data: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>) => any
  >,
  TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {},
>(
  options: ComputedOptions<
    TData,
    TProperty,
    TMethod,
    TWatch,
    TComputed,
    TCustomInstanceProperty
  >,
): string {
  if (!Array.isArray(options.behaviors)) {
    options.behaviors = []
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
