import { Request, Response } from 'express';
import { Endpoint } from './endpoint';

export type EndpointDecorator = (
    target: {
        new(req: Request, res: Response): Endpoint;
    }
) => void;