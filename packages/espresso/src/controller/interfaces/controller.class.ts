import { Request, Response } from 'express';
import { Controller } from '../controller';

export interface ControllerClass {
    new(req: Request, res: Response): Controller;
}