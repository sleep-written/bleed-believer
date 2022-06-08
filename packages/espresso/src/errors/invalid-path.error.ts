export class InvalidPathError extends Error {
    constructor() {
        super('The path given is invalid.');
    }
}
