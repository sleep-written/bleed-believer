import type { ControllerClass } from '../../controller/index.js';
import type { ControllerRoutingClass } from './controller-routing.class.js';

export interface ControllerRoutingOptions {
    /**
     * If this option is settled, all descendants of this `ControllerRouting`
     * class will begin their paths with this one, separated with an `/`.
     */
    path?: string;

    /**
     * Sets the `ControllerRouting` classes nested to this one.
     */
    routes?: ControllerRoutingClass[];

    /**
     * Sets the `Controller` classes nested to this one.
     */
    controllers?: ControllerClass[];
}
