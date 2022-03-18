import { Meta } from '@bleed-believer/meta';

import { EndpointMeta } from './endpoint.meta';
import { Request, Response } from 'express';

export const ENDPOINT = new Meta<EndpointMeta>();
export abstract class Endpoint {
    protected get req(): Request {
        return this._req;
    }

    protected get res(): Response {
        return this._res;
    }

    constructor(
        private _req: Request,
        private _res: Response,
    ) { }
}
