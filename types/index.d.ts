export { behavior, computed, watch } from './behavior';
type ComputedInstance<D extends WechatMiniprogram.Component.DataOption, P extends WechatMiniprogram.Component.PropertyOption, M extends WechatMiniprogram.Component.MethodOption, B extends WechatMiniprogram.Component.BehaviorOption, C extends Record<string, (data: D & {
    [K in keyof P]: any;
}) => any>, TCustomProperty extends WechatMiniprogram.IAnyObject = Record<string, never>> = WechatMiniprogram.Component.Instance<D, P, M, B, TCustomProperty> & {
    data: {
        [K in keyof C]: ReturnType<C[K]>;
    } & {
        [K in keyof P]: any;
    };
};
type ComputedOptions<TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TWatch extends Record<string, (...args: any[]) => void>, TComputed extends Record<string, (data: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>) => any>, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}> = (Partial<WechatMiniprogram.Component.Data<TData>> & Partial<WechatMiniprogram.Component.Property<TProperty>> & Partial<WechatMiniprogram.Component.Method<TMethod>> & Partial<WechatMiniprogram.Component.Behavior<TBehavior>> & Partial<WechatMiniprogram.Component.OtherOption> & Partial<WechatMiniprogram.Component.Lifetimes> & {
    watch?: TWatch;
    computed?: TComputed;
    template?: string;
}) & ThisType<ComputedInstance<TData, TProperty, TMethod, TBehavior, TComputed, TCustomInstanceProperty>>;
export declare function ComponentWithComputed<TData extends WechatMiniprogram.Component.DataOption, TProperty extends WechatMiniprogram.Component.PropertyOption, TMethod extends WechatMiniprogram.Component.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TWatch extends Record<string, (...args: any[]) => void>, TComputed extends Record<string, (data: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>) => any>, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: ComputedOptions<TData, TProperty, TMethod, TBehavior, TWatch, TComputed, TCustomInstanceProperty>): string;
export declare function BehaviorWithComputed<TData extends WechatMiniprogram.Behavior.DataOption, TProperty extends WechatMiniprogram.Behavior.PropertyOption, TMethod extends WechatMiniprogram.Behavior.MethodOption, TBehavior extends WechatMiniprogram.Component.BehaviorOption, TWatch extends Record<string, (...args: any[]) => void>, TComputed extends Record<string, (data: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>) => any>, TCustomInstanceProperty extends WechatMiniprogram.IAnyObject = {}>(options: ComputedOptions<TData, TProperty, TMethod, TBehavior, TWatch, TComputed, TCustomInstanceProperty>): string;
export declare enum DataTracerMode {
    Auto = 0,
    Proxy = 1,
    DefineProperty = 2
}
export declare const getCurrentDataTracerMode: () => DataTracerMode;
export declare const setCurrentDataTracerMode: (mode: DataTracerMode) => void;
