export class ValueNotFoundError extends Error {
    constructor() {
        super('The value requested doesn\'t exist inside of the metadata');
    }
}
