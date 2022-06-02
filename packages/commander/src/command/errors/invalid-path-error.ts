export class InvalidPathError extends Error {
    constructor() {
        super(`The path provided has an invalid format.`);
    }
}
