export class EmptyControllerError extends Error {
    constructor() {
        super('The current controller class doesn\'t has endpoints declared.');
    }
}
