import type * as adapter from 'glass-easel-miniprogram-adapter';
export declare const behavior: string;
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
export declare const watch: (ctx: adapter.builder.BuilderContext<any, any, any>, watchPath: string, listener: (...args: any[]) => void) => void;
