export class DuplicatedInstanceError extends Error {
    constructor() {
        super('Cannot create more than one instance of "Commander".');
    }
}
