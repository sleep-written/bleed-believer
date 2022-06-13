export interface TsconfigData {
    extends: string;
    compilerOptions: {
        rootDir: string;
        outDir: string;

        baseUrl: string;
        paths: Record<string, string[]>;
    }
}
