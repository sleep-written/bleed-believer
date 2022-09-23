import type { EndpointDecorator, EndpointMeta } from './interfaces/index.js';
import type { ControllerMeta } from '../controller/index.js';
import type { HttpMethods } from '../interfaces/index.js';

import { DuplicatedEndpointError } from '../errors/index.js';
import { CONTROLLER } from '../controller/index.js';
import { Path } from '../path/index.js';

export function methodFactory(method: keyof HttpMethods) {
    return function(path?: string): EndpointDecorator {
        return (target, key, _) => {
            // Get or create metadata
            const meta: ControllerMeta =
                    CONTROLLER.get(target.constructor, true)
                ??  { endpoints: [] };

            // Create the endpoint
            const endpoint: EndpointMeta = {
                key, method,
                path: Path.normalize(path)
            };

            // Clean path
            if (endpoint.path == null) {
                delete endpoint.path;
            }

            // Check if another endpoint with same data exists
            if (meta.endpoints.some(x => (
                x.path === endpoint.path &&
                x.method === endpoint.method
            ))) {
                throw new DuplicatedEndpointError(
                    Path.fromInstance(target) + (
                        typeof endpoint.path === 'string'
                            ?   endpoint.path
                            :   ''
                        ),
                    method
                );
            }

            // Add the new endpoint
            meta.endpoints.push(endpoint);
            CONTROLLER.set(target.constructor, meta);
        };
    }
}