import { ControllerClass } from '../controller';
import { HttpMethods } from '../interfaces';

export interface FlattedRoute {
    key: string | symbol;
    path: string;
    class: ControllerClass;
    method: keyof HttpMethods;
}
