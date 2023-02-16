export abstract class Task {
    abstract launch(): void | Promise<void>;
}
