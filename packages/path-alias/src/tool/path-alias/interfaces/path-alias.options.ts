export interface PathAliasOptions {
    cwd: string;
    entryPoint: string;
    isFileExists(path: string): Promise<boolean>;
    isModuleInstalled(path: string): boolean;
}