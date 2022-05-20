export class UndefinedMetaError extends Error {
    constructor() {
        super('The target doesn\'t contain the requested metadata.');
    }
}
