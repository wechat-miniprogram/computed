import * as dataTracer from './data-tracer';
import type * as adapter from 'glass-easel-miniprogram-adapter';
interface BehaviorData {
    _computedWatchInit: ComputedWatchInitStatus;
    [k: string]: any;
}
interface BehaviorExtend {
    data: BehaviorData;
    setData(d: Record<string, any>): void;
    _computedWatchInfo: Record<string, ComputedWatchInfo>;
}
interface ComputedWatchInfo {
    computedUpdaters: Array<(...args: unknown[]) => boolean>;
    computedRelatedPathValues: Array<Array<dataTracer.RelatedPathValue>>;
    watchCurVal: Array<unknown>;
    watchDisabled: boolean;
}
declare enum ComputedWatchInitStatus {
    CREATED = 0,
    ATTACHED = 1,
    DISABLE_WATCHES = 2,
    ENABLE_WATCHES = 3,
    CALL_WATCHES = 4
}
export declare const behavior: WechatMiniprogram.Behavior.BehaviorIdentifier<WechatMiniprogram.Component.DataOption, WechatMiniprogram.Component.PropertyOption, {
    disableWatches(): void;
    enableWatches(callWatchesImmediately: boolean): void;
    triggerAllWatches(): void;
}, WechatMiniprogram.Component.BehaviorOption>;
export declare function computed<TComputedDefinition1 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>) => any;
}, TPrevData extends adapter.glassEasel.typeUtils.DataList, TProperty extends adapter.glassEasel.typeUtils.PropertyList>(ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>, computedDefinition1: TComputedDefinition1): adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
    [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
}, TProperty>;
export declare function computed<TComputedDefinition1 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>) => any;
}, TComputedDefinition2 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
        [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
    }, TProperty>) => any;
}, TPrevData extends adapter.glassEasel.typeUtils.DataList, TProperty extends adapter.glassEasel.typeUtils.PropertyList>(ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>, computedDefinition1: TComputedDefinition1, computedDefinition2: TComputedDefinition2): adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
    [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
} & {
    [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>;
}, TProperty>;
export declare function computed<TComputedDefinition1 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>) => any;
}, TComputedDefinition2 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
        [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
    }, TProperty>) => any;
}, TComputedDefinition3 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
        [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
    } & {
        [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>;
    }, TProperty>) => any;
}, TPrevData extends adapter.glassEasel.typeUtils.DataList, TProperty extends adapter.glassEasel.typeUtils.PropertyList>(ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>, computedDefinition1: TComputedDefinition1, computedDefinition2: TComputedDefinition2, computedDefinition3: TComputedDefinition3): adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
    [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
} & {
    [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>;
} & {
    [k in keyof TComputedDefinition3]: ReturnType<TComputedDefinition3[k]>;
}, TProperty>;
export declare function computed<TComputedDefinition1 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData, TProperty>) => any;
}, TComputedDefinition2 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
        [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
    }, TProperty>) => any;
}, TComputedDefinition3 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
        [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
    } & {
        [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>;
    }, TProperty>) => any;
}, TComputedDefinition4 extends {
    [k: string]: (data: adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
        [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
    } & {
        [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>;
    } & {
        [k in keyof TComputedDefinition3]: ReturnType<TComputedDefinition3[k]>;
    }, TProperty>) => any;
}, TPrevData extends adapter.glassEasel.typeUtils.DataList, TProperty extends adapter.glassEasel.typeUtils.PropertyList>(ctx: adapter.builder.BuilderContext<TPrevData, TProperty, any>, computedDefinition1: TComputedDefinition1, computedDefinition2: TComputedDefinition2, computedDefinition3: TComputedDefinition3, computedDefinition4: TComputedDefinition4): adapter.glassEasel.typeUtils.DataWithPropertyValues<TPrevData & {
    [k in keyof TComputedDefinition1]: ReturnType<TComputedDefinition1[k]>;
} & {
    [k in keyof TComputedDefinition2]: ReturnType<TComputedDefinition2[k]>;
} & {
    [k in keyof TComputedDefinition3]: ReturnType<TComputedDefinition3[k]>;
} & {
    [k in keyof TComputedDefinition4]: ReturnType<TComputedDefinition4[k]>;
}, TProperty>;
export declare const generateWatches: (self: BehaviorExtend) => {
    disableWatches(): void;
    enableWatches(triggerWatchesImmediately: boolean): void;
    triggerAllWatches(): void;
};
export declare const watch: (ctx: adapter.builder.BuilderContext<any, any, any>, watchPath: string, listener: (...args: any[]) => void) => {
    disableWatches(): void;
    enableWatches(triggerWatchesImmediately: boolean): void;
    triggerAllWatches(): void;
};
export {};
