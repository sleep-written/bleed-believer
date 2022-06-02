export interface Executable {
    start(): void | Promise<void>;
}
