interface IWrappedData {
    __rawObject__: unknown;
}
export interface IRelatedPathValue {
    path: Array<string>;
    value: unknown;
}
export declare function create(data: unknown, relatedPathValues: Array<IRelatedPathValue>): any;
export declare function unwrap(wrapped: IWrappedData): any;
export {};
