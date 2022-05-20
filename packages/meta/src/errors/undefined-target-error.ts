export class UndefinedTargetError extends Error {
    constructor() {
        super('Cannot get the meta storage of a null or undefined target.');
    }
}