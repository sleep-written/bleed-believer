export class FetchError extends Error {
    constructor(url: string) {
        super(`Failed to fetch '${url}'`);
    }
}