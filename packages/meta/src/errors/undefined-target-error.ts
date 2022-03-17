export class UndefinedTargetError extends Error {
    constructor() {
        super('The target is null or undefined.');
    }
}
