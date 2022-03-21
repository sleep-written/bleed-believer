import { ControllerClass } from '../../controller';
import { ControllerRoutingClass } from './controller-routing.class';

export interface ControllerRoutingMeta {
    path?: string;
    routes: ControllerRoutingClass[];
    controllers: ControllerClass[];
}
