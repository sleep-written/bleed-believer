import type { ControllerRoutingClass } from '../controller-routing/index.js';
import type { FlattedRoute } from './flatted-route.js';

import { CONTROLLER_ROUTING } from '../controller-routing/index.js';
import { CONTROLLER } from '../controller/index.js';
import { Path } from '../path/index.js';

export function flattenRoutes(route: ControllerRoutingClass, lowercase?: boolean): FlattedRoute[] {
    const meta = CONTROLLER_ROUTING.get(route);
    const out: FlattedRoute[] = [];

    let routePath = meta.path ?? '';
    if (lowercase && !routePath.match(/^\/:/gi)) {
        routePath = Path.toLower(routePath);
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

    // Iterate over controllers
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
    
    return out;
}
