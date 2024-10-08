export type RelatedPathValue = {
    kind: 'value';
    path: Array<string>;
    value: unknown;
} | {
    kind: 'keys';
    path: Array<string>;
    keys: Array<string>;
};
export declare function create(data: unknown, relatedPathValues: Array<RelatedPathValue>): any;
export declare function unwrap(wrapped: unknown): any;
