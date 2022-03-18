import { Meta } from '@bleed-believer/meta';

import { EndpointMeta } from './endpoint.meta';
import { Request, Response } from 'express';

export const ENDPOINT = new Meta<EndpointMeta>();
export abstract class Endpoint {
    /**
     * The __request__ object incomming from `express.js`
     */
    protected get requ(): Request {
        return this._requ;
    }

    /**
     * The __response__ object incomming from `express.js`
     */
    protected get resp(): Response {
        return this._resp;
    }

    constructor(
        private _requ: Request,
        private _resp: Response,
    ) { }
}
