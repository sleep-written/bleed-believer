export class TsconfigFileNotFoundError extends Error {
    constructor() {
        super(`Cannot found a valid typescript configuration file`);
    }
}
