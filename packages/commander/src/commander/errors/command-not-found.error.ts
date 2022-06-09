export class CommandNotFoundError extends Error {
    constructor() {
        super('The command requested isn\' found throught the routings provided.');
    }
}