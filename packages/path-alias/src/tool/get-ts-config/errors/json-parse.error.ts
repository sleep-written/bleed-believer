export class JSONParseError extends Error {
    constructor(url: string) {
        super(`Cannot parse the JSON data at '${url}'`);
    }
}