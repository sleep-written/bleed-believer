export class TsconfigFileNotFoundError extends Error {
    constructor(path?: string) {
        super(
            typeof path === 'string'
            ?   `Cannot found the "${path}" typescript configuration file`
            :   `Cannot found a valid typescript configuration file`
        );
    }
}
