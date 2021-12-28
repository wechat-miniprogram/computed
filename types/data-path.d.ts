export declare const parseMultiDataPaths: (path: string) => {
    path: string[];
    options: {
        deepCmp: boolean;
    };
}[];
export declare const getDataOnPath: (data: unknown, path: Array<string>) => unknown;
