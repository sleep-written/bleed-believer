import type {
    ControllerRoutingDecorator,
    ControllerRoutingOptions,
    ControllerRoutingMeta,
} from './interfaces/index.js';

import { MetaManager } from '@bleed-believer/meta';
import { Path } from '../path/index.js';

export const CONTROLLER_ROUTING = new MetaManager<ControllerRoutingMeta>();

/**
 * Converts a class into a `ControllerRouting` class. The `ControllerRouting` class can store a great
 * amount of `Controller` classes, or also another `ControllerRouting` classes.
 * @param options An object with the options to define the descendant of the current `ControllerRouting` class.
 */
export function ControllerRouting(options: ControllerRoutingOptions): ControllerRoutingDecorator {
    return target => {
        // Build metadata
        const meta: ControllerRoutingMeta = {
            controllers:    options.controllers ?? [],
            routes:         options.routes      ?? []
        };
        
        // Assign the parsed path
        const parsedPath = Path.normalize(options.path);
        if (typeof parsedPath === 'string') {
            meta.path = parsedPath;
        }

        // Save the metadata
        CONTROLLER_ROUTING.set(target, meta);
    };
}
