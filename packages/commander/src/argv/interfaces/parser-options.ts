export interface ParserOptions {
    /**
     * By default, the key (with format `--key`) gather only the value
     * immediately next to it right. If you set the linear mode to `true`,
     * all values placed to the right of the current key will be assigned
     * to that key, until another key has been defined.
     */
    linear?: boolean;

    /**
     * If this value is `true`, all keys (with format `--key`) will be
     * converted to lowercase before to be parsed. That allows to group
     * values with case insensitive.
     */
    lowercase?: boolean;
}