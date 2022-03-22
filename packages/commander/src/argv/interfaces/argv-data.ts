export interface ArgvData {
    /**
     * The __required arguments__ captured with the `"..."` wildcard.
     */
    items: string[];

    /**
     * The __required arguments__ captured with the `":name"` wildcard format.
     */
    param: Record<string, string>;
}
