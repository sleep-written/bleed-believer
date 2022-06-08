/**
 * Declares an event that to be executed when the found `Command` class target __throws an error.__
 */
export interface FailedCommand {
    /**
     * A method which will be triggered when an error is
     * thrown during the execution of the command.
     * @param err An object throwed by the Command class target.
     */
    failed(err: any | unknown): void | Promise<void>;
}