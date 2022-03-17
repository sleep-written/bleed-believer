export interface FailedCommand {
    failed(error: any): void | Promise<void>;
}
