/**
 * Declares an event that to be executed __after__ to the found `Command` class target.
 */
export interface AfterCommand {
    /**
     * A method which will be triggered __after__ the command execution.
     */
    after(): void | Promise<void>;
}