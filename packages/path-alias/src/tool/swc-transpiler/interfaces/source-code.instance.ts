export interface SourceCodeInstance {
    get path(): string;

    transpile(): Promise<void>;
}
