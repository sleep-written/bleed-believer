export interface Argv {
    get main(): string[];
    get data(): Record<string, string[]>;
}