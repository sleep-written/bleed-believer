import { ControllerRoutingClass, CONTROLLER_ROUTING } from '../controller-routing';
import { FlattedRoute } from './flatted-route';
import { CONTROLLER } from '../controller';
import { Path } from '../path';

export function flattenRoutes(route: ControllerRoutingClass, lowercase?: boolean): FlattedRoute[] {
    const meta = CONTROLLER_ROUTING.get(route);
    let routePath = meta.path ?? '';
    if (lowercase && !routePath.match(/^\/:/gi)) {
        routePath = Path.toLower(routePath);
    }

    // Iterate over controllers
    const out: FlattedRoute[] = [];
    for (const ctrl of meta.controllers) {
        const ctrlMeta = CONTROLLER.get(ctrl);
        let ctrlPath = typeof ctrlMeta.path === 'string'
            ?   ctrlMeta.path
            :   Path.fromClass(ctrl);

        if (lowercase && !ctrlPath.match(/^\/:/gi)) {
            ctrlPath = Path.toLower(ctrlPath);
        }
        
        for (const endpoint of ctrlMeta.endpoints) {
            let endpPath = endpoint.path ?? '';
            if (lowercase && !endpPath.match(/^\/:/gi)) {
                endpPath = Path.toLower(endpPath.toLowerCase());
            }

            const fullPath = `${routePath}${ctrlPath}${endpPath}`;
            out.push({
                ...endpoint,
                class: ctrl,
                path: fullPath.length
                    ?   fullPath
                    :   '/'
            });
        }
    }

    // Iterates recursivelly across nested routes
    for (const innerRoute of meta.routes) {
        const flatted = flattenRoutes(innerRoute, lowercase);
        for (const flat of flatted) {
            out.push({
                ...flat,
                path: `${routePath}${flat.path}`
            });
        }
    }
    
    return out;
}
