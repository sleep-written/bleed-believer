import { Argv } from '../argv';

export interface AfterCommand {
    /**
     * This method is executed after the execution of the `Command` class
     * found, or after an error catched with the `failed(...)` method (if
     * the `FailedCommand` interface was implemented).
     * @param argv An object with all Argv data parsed.
     */
    after(argv: Argv): void | Promise<void>;
}
