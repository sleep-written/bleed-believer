import { ControllerClass } from '../../controller/index.js';
import { ControllerRoutingClass } from './controller-routing.class.js';

export interface ControllerRoutingMeta {
    path?: string;
    routes: ControllerRoutingClass[];
    controllers: ControllerClass[];
}
