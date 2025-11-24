export interface TSConfigLoadInject {
    process?: {
        cwd(): string;
    };

    readFile?: (
        path: string,
        encoding: 'utf-8'
    ) => Promise<string>;

    access?: (
        path: string
    ) => Promise<void>;
}