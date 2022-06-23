export class ConfigNotFoundError extends Error {
    constructor() {
        super('Cannot found a valid "tsconfig.json" file');
    }
}