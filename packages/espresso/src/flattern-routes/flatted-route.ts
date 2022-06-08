import { ControllerClass } from '../controller/index.js';
import { HttpMethods } from '../interfaces/index.js';

export interface FlattedRoute {
    key: string | symbol;
    path: string;
    class: ControllerClass;
    method: keyof HttpMethods;
}
