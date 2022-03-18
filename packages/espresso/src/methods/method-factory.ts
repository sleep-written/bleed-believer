import { MethodMeta } from './method.meta';
import { HttpMethods } from '../interfaces';
import { normalizePath } from '../tool';
import { Endpoint, ENDPOINT, EndpointMeta } from '../endpoint';
import { DuplicatedMethodError, InvalidTargetClassError } from '../errors';

export function methodFactory(method: keyof HttpMethods): (path?: string) => MethodDecorator {
    return path => {
        return (target, key) => {
            // Check method owner
            if (!(target.constructor.prototype instanceof Endpoint)) {
                throw new InvalidTargetClassError();
            }

            // Get the class meta
            const meta: EndpointMeta = ENDPOINT.some(target.constructor)
                ?   ENDPOINT.get(target.constructor)
                :   {
                    main: target.constructor.name,
                    paths: []
                };

            // Build new registry
            const item: MethodMeta = {
                key,
                method,
                path: normalizePath(path)
            };

            // Find coincidences
            if (meta.paths.some(x => 
                (x.method === method) &&
                (x.path === item.path)
            )) {
                throw new DuplicatedMethodError(item, meta.main);
            }

            // Save changes
            meta.paths.push(item);
            ENDPOINT.set(target.constructor, meta);
        }
    }
}