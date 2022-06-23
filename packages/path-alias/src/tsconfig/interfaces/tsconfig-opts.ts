export interface TsconfigOpts {
    module: 'ES2022';
    rootDir: string;
    outDir: string;

    baseUrl: string;
    paths: Record<string, string[]>;
}