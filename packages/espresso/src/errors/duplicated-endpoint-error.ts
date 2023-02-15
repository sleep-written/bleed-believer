import type { HttpMethods } from '../interfaces/index.js';

export class DuplicatedEndpointError extends Error {
    constructor();
    constructor(path: string, method: keyof HttpMethods);
    constructor(...args: [] | [path: string, method: keyof HttpMethods]) {
        if (args.length === 2) {
            super(
                    `This controller has already another endpoint with `
                +   `the path "${args[0]}" and the method "${args[1].toUpperCase()}"`
            );
        } else {
            super('A controller cannot has two or more endpoints with the same path and method.');
        }
    }
}