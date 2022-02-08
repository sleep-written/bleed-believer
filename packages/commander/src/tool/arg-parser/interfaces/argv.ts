export interface Argv {
    get main(): string[];
    get args(): Record<string, string[]>;
}
