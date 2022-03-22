export interface CommandOptions {
    /**
     * The required arguments to match with the __execution arguments__.
     */
    main: string;

    /**
     * A friendly name to identify this command.
     */
    name: string;

    /**
     * A detailed description of the usage of this command.
     */
    info?: string;
}