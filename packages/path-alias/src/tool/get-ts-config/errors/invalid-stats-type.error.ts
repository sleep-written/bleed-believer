export class InvalidStatsTypeError extends Error {
    constructor(path?: string) {
        super(
            typeof path === 'string'
            ?   `The Stats type from '${path}' must be a file or a directory`
            :   `The Stats type must be a file or a directory`
        );
    }
}
