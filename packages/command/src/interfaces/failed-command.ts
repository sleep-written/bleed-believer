export interface FailedCommand {
    failed(e: Error): void | Promise<void>;
}
