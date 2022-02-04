export class MetadataNotFoundError extends Error {
    constructor(symbol?: symbol) {
        super();

        if (symbol) {
            this.message =  `The target object doesn't have metadata with `
                        +   `described as "${symbol.description}".`;
        } else {
            this.message =  `The target object doesn't have metadata with `
                        +   `the symbol given.`;
        }
    }
}
