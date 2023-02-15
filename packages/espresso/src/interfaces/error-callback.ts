import type { Request, Response } from 'express';

export type ErrorCallback = (
    err: any,
    req: Request,
    res: Response,
) => void | Promise<void>;
