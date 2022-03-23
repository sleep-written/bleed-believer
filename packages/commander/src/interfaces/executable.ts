import { Argv, ArgvData } from '../argv';

export interface Executable {
    /**
     * This is the entry point of a `Command` class type. When the class
     * is found by the `Commander` instance, first creates an instance
     * of this class, and then executes this method.
     * @param argv The Argv arguments parsed.
     * @param data The data captured from Argv using wildcards.
     */
    start(argv: Argv, data: ArgvData): void | Promise<void>;
}
