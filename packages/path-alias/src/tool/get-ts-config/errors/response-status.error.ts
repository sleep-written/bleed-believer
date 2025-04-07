export class ResponseStatusError extends Error {
    constructor(status: number, url?: string) {
        super(
            typeof url === 'string'
            ?   `The fetch response of url '${url}' throws a '${status}' status code`
            :   `The fetch response throws a '${status}' status code`
        );
    }
}