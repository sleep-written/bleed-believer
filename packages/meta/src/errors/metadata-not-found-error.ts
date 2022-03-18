export class MetadataNotFoundError extends Error {
    constructor(target?: any) {
        if (target?.name) {
            super(`The object "${target.name}" doesn't have the required metadata.`);
        } else {
            super(`The current object doesn't have the required metadata.`);
        }
    }
}
