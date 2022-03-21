import { EndpointDecorator, EndpointMeta } from './interfaces';
import { DuplicatedEndpointError } from '../errors';

import { ControllerMeta, CONTROLLER } from '../controller';
import { normalizePath } from '../tool';
import { HttpMethods } from '../interfaces';

export function methodFactory(method: keyof HttpMethods) {
    return function(path?: string): EndpointDecorator {
        return (target, key, _) => {
            // Get or create metadata
            const meta: ControllerMeta = CONTROLLER.some(target.constructor)
                ?   CONTROLLER.get(target.constructor)
                :   {
                    path: target.constructor.name,
                    endpoints: []
                };

            // Create the endpoint
            const endpoint: EndpointMeta = {
                key, method,
                path: normalizePath(path)
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
                    endpoint.path ?? meta.path,
                    method
                );
            }

            // Add the new endpoint
            meta.endpoints.push(endpoint);
            CONTROLLER.set(target.constructor, meta);
        };
    }
}