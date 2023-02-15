import type { Request, Response } from 'express';
import type { Controller } from '../controller.js';

export interface ControllerClass {
    new(req: Request, res: Response): Controller;
}