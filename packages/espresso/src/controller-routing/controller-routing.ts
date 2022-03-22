import { Meta } from '@bleed-believer/meta';
import { Path } from '../path';
import { normalizePath } from '../tool';

import {
    ControllerRoutingDecorator,
    ControllerRoutingOptions,
    ControllerRoutingMeta,
} from './interfaces';

export const CONTROLLER_ROUTING = new Meta<ControllerRoutingMeta>();
export function ControllerRouting(
    { routes, controllers, path }: ControllerRoutingOptions
): ControllerRoutingDecorator {
    return target => {
        // Build metadata
        const meta: ControllerRoutingMeta = {
            controllers:    controllers ?? [],
            routes:         routes      ?? []
        };
        
        // Assign the parsed path
        const parsedPath = Path.normalize(path);
        if (typeof parsedPath === 'string') {
            meta.path = parsedPath;
        }

        // Save the metadata
        CONTROLLER_ROUTING.set(target, meta);
    };
}
