import { ENDPOINT, EndpointMeta } from '../endpoint';
import { normalizePath } from '../tool';
import { HttpMethods } from '../interfaces';

export function methodFactory(method: keyof HttpMethods): (path?: string) => MethodDecorator {
    return path => {
        return (target, key) => {
            // Get the class meta
            const meta: EndpointMeta = ENDPOINT.some(target.constructor)
                ?   ENDPOINT.get(target.constructor)
                :   {
                    main: target.constructor.name,
                    paths: []
                };

            // Find coincidences
            const pathNNN = normalizePath(path);
            if (meta.paths.some(x => 
                (x.path === pathNNN) &&
                (x.method === method)
            )) {
                throw new Error(`The path "${pathNNN}" is already registered in this endpoint`);
            }

            // Insert the new registry
            meta.paths.push({
                key,
                method,
                path: normalizePath(path)
            });

            // Save changes
            ENDPOINT.set(target.constructor, meta);
        }
    }
}