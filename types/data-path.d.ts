export type DataPathWithOptions = {
    path: string[];
    options: {
        deepCmp: boolean;
    };
};
export declare const parseMultiDataPaths: (path: string) => DataPathWithOptions[];
export declare const getDataOnPath: (data: unknown, path: Array<string>) => unknown;
