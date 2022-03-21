import { ControllerClass } from '../../controller';
import { ControllerRoutingClass } from './controller-routing.class';

export interface ControllerRoutingOptions {
    path?: string;
    routes?: ControllerRoutingClass[];
    controllers?: ControllerClass[];
}
