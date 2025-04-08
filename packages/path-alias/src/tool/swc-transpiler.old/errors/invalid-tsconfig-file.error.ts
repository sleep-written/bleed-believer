export class InvalidTsconfigFileError extends Error {
    constructor(path?: string) {
        super(
            typeof path === 'string'
            ?   `The file '${path}' isn't a valid typescript configuration file`
            :   `The file provided isn't a valid typescript configuration file`
        );
    }
}