export interface EspressoOptions {
    /**
     * If this options is `true`, all endpoints will be injected in lowercase.
     * Use this option if do you want to use the default controller names in
     * lowercase without to set explicitly in all controllers.
     */
    lowercase: boolean;

    /**
     * If this option is `true`, all injection process will be written in
     * the terminal.
     */
    verbose: boolean;
}