import { CONTROLLER } from '../controller';
import { ControllerRoutingClass, CONTROLLER_ROUTING } from '../controller-routing';
import { FlattedRoute } from './flatted-route';

export function flattenRoutes(route: ControllerRoutingClass): FlattedRoute[] {
    const meta = CONTROLLER_ROUTING.get(route);
    const path = typeof meta.path === 'string'
        ?   `/${meta.path}`
        :   '';

    // Iterate over controllers
    const out: FlattedRoute[] = [];
    for (const ctrl of meta.controllers) {
        const ctrlMeta = CONTROLLER.get(ctrl);
        for (const endpoint of ctrlMeta.endpoints) {
            out.push({
                ...endpoint,
                class: ctrl,
                path: typeof endpoint.path === 'string'
                    ?   `${path}/${ctrlMeta.path}/${endpoint.path}`
                    :   `${path}/${ctrlMeta.path}`
            });
        }
    }

    // Iterates recursivelly across nested routes
    for (const innerRoute of meta.routes) {
        const flatted = flattenRoutes(innerRoute);
        for (const flat of flatted) {
            out.push({
                ...flat,
                path: `${path}${flat.path}`
            });
        }
    }
    
    return out;
}
