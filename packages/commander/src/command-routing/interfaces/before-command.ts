export interface BeforeCommand {
    /**
     * A method which will be triggered before the command execution.
     */
    before(): void | Promise<void>;
}
