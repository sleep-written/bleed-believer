import { STATUS_CODES } from 'http';

/**
 * Custom error class to represent HTTP endpoint errors, encapsulating status codes, 
 * descriptive messages, and titles derived from standard HTTP status descriptions.
 */
export class EndpointError extends Error {
    #status: number;

    /**
     * Retrieves the HTTP status code associated with this error.
     * @returns {number} The HTTP status code.
     */
    get status(): number {
        return this.#status;
    }

    /**
     * Retrieves a descriptive title for this error based on the HTTP status code, 
     * or a default title if the status is invalid.
     * @returns {string} The title of the error.
     */
    #title: string;
    get title(): string {
        return this.#title;
    }

    /**
     * Constructs an instance of EndpointError with a specified HTTP status code and message.
     * If the provided status code is invalid, it defaults to a 500 status code (Internal Server Error).
     * 
     * @param status - HTTP status code for the error.
     * @param message - Error message to describe the error condition.
     */
    constructor(status: number, message: string);

    /**
     * Constructs an EndpointError instance that wraps an existing Error object.
     * If the provided error is not an instance of EndpointError, a default status of 
     * 500 (Internal Server Error) is used.
     * 
     * @param error - An existing Error object to wrap within EndpointError.
     */
    constructor(error: Error);
    constructor(...[ arg1, arg2 ]: [ number, string ] | [ Error ] ) {
        if (typeof arg1 === 'number') {
            super(arg2);
            this.#status = STATUS_CODES[arg1] != null
                ?   arg1
                :   500;
        } else if (arg1 instanceof EndpointError) {
            super(arg1.message);
            this.#status = arg1.status;
        } else {
            super(arg1.message);
            this.#status = 500;
        }

        this.#title = STATUS_CODES[this.#status]!;
    }

    /**
     * Converts the error to an HTML string representation.
     * @returns {string} An HTML-formatted string that displays the status and message.
     */
    toString(): string {
        return [
            `<!DOCTYPE html>`,
            `<head>`,
            `   <meta charset="UTF-8" />`,
            `   <title>${this.#title}</title>`,
            `</head>`,
            `   <pre>${this.message}</pre>`,
            `<body>`,
            `</body>`,
            `</html>`,
        ].join('\n');
    }
}