export interface Argv {
    /**
     * An array with all __required arguments__
     * given by the user or another program.
     */
    get main(): string[];

    /**
     * An object with all __optional arguments__
     * given by the user or another program.
     */
    get flags(): Record<string, string[]>;
}
