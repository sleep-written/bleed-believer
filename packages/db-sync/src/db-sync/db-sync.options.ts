/**
 * Defines the options that can be passed to the DBSync constructor.
 */
export interface DBSyncOptions {
    /**
     * Specifies the verbosity of the sync operation's logging output.
     * This can be either a boolean to toggle logging on or off,
     * or a custom function that handles logging. The custom function
     * can accept any number of arguments which are the log contents.
     */
    verbose?:
        boolean |
        ((...args: any[]) => void);
}