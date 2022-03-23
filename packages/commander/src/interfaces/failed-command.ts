export interface FailedCommand {
    /**
     * Catches an unexpected error inside of a `Command` class without
     * disturb the main execution process.
     * @param error The ofject throwed by the error.
     */
    failed(error: any): void | Promise<void>;
}
