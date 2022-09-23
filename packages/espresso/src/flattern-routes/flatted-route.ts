import type { ControllerClass } from '../controller/index.js';
import type { HttpMethods } from '../interfaces/index.js';

export interface FlattedRoute {
    key: string | symbol;
    path: string;
    class: ControllerClass;
    method: keyof HttpMethods;
}
