import type { ControllerClass } from '../../controller/index.js';
import type { ControllerRoutingClass } from './controller-routing.class.js';

export interface ControllerRoutingMeta {
    path?: string;
    routes: ControllerRoutingClass[];
    controllers: ControllerClass[];
}
