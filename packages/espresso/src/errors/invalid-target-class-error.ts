export class InvalidTargetClassError extends Error {
    constructor() {
        super('The method\'s owner class isn\'t an Endpoint descendant class.');
    }
}