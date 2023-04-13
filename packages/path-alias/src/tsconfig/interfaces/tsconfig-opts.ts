export interface TsconfigOpts {
    rootDir: string;
    outDir: string;

    baseUrl: string;
    paths: Record<string, string[]>;
}