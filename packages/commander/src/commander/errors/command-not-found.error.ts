export class CommandNotFoundError extends Error {
    constructor() {
        super('The command requested isn\'t found throught the routings provided.');
    }
}