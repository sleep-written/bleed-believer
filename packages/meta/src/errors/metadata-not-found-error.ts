export class MetadataNotFoundError extends Error {
    constructor() {
        super('Metadata no found, please create one first.');
    }
}
