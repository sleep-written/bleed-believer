import { Request, Response } from 'express';
import { Meta } from '@bleed-believer/meta';

import { ControllerMeta } from './controller.meta';

export const CONTROLLER = new Meta<ControllerMeta>();
export abstract class Controller {
    #request: Request;
    protected get request(): Request {
        return this.#request;
    }

    #response: Response;
    protected get response(): Response {
        return this.#response;
    }

    constructor(request: Request, response: Response) {
        this.#request = request;
        this.#response = response;
    }
}