import type { Request, Response } from 'express';
import type { ControllerMeta } from './interfaces/index.js';

import { MetaManager } from '@bleed-believer/meta';

export const CONTROLLER = new MetaManager<ControllerMeta>();

/**
 * The core of the controller classes. Exposes the `Request` and `Response`
 * object from the `express.js` instance. Read
 * [this article](https://github.com/sleep-written/bleed-believer/blob/HEAD/docs/espresso/controllers.md)
 * for details.
 */
export abstract class Controller {
    #request: Request;
    /**
     * The `Request` object exposed by the `express.js` instance when an endpoint is deployed.
     */
    protected get request(): Request {
        return this.#request;
    }

    #response: Response;
    /**
     * The `Response` object exposed by the `express.js` instance when an endpoint is deployed.
     */
    protected get response(): Response {
        return this.#response;
    }

    constructor(request: Request, response: Response) {
        this.#request = request;
        this.#response = response;
    }
}