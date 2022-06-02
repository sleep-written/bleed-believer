export interface AfterCommand {
    /**
     * A method which will be triggered after the command execution.
     */
    after(): void | Promise<void>;
}