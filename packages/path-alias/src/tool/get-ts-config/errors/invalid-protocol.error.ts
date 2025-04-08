export class InvalidProtocolError extends Error {
    constructor(protocol?: string) {
        super(
            typeof protocol === 'string'
            ?   `The protocol "${protocol}" is invalid`
            :   `The protocol is invalid`
        );
    }
}