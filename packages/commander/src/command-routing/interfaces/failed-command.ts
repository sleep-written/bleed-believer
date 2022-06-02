export interface FailedCommand {
    /**
     * A method which will be triggered when an error is
     * thrown during the execution of the command.
     * @param err An error instance.
     */
    failed(err: Error): void | Promise<void>;
}