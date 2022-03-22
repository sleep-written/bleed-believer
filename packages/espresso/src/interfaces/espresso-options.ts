export interface EspressoOptions {
    /**
     * If this options is `true`, all endpoints will be injected in lowercase.
     * Use this option if do you want to use the default controller names in
     * lowercase without to set explicitly in all controllers.
     * 
     * ### Disclaimer:
     * If your `Controller` class has a name with multiples words (for example
     * `BleedBelieverController`), the path of that class in lowercase mode
     * will be `"bleed-believer"` (using `"-"` as word separator).
     */
    lowercase: boolean;

    /**
     * If this option is `true`, all injection process will be written in the
     * terminal. This is useful if you need to see how this library parses
     * every route before to inject into the target instance.
     */
    verbose: boolean;
}