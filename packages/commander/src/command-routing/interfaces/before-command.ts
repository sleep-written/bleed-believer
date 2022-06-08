/**
 * Declares an event that to be executed __before__ to the found `Command` class target.
 */
export interface BeforeCommand {
    /**
     * A method which will be triggered __before__ the command execution.
     */
    before(): void | Promise<void>;
}
