import type { ErrorCallback, EspressoOptions } from './interfaces/index.js';
import type { ControllerRoutingClass } from './controller-routing/index.js';
import type { FlattedRoute } from './flattern-routes/index.js';
import type { Express } from 'express';

import { flattenRoutes } from './flattern-routes/index.js';

/**
 * This class wraps an `express.js` instance, for routing injection.
 * How to use:
 * @example
 * ```ts
 * import express from 'express';
 * import { Espresso } from '@bleed-believer/espresso';
 * import { ApiRouting } from './api.routing.js';
 * 
 * // Create your express.js instance
 * const app = express();
 * 
 * // Create a new Espresso instance
 * const espresso = new Espresso(app);
 * 
 * // Inject your root "ControllerRouting" class
 * espresso.inject(ApiRouting);
 * 
 * // Start your api rest
 * app.listen(8080, () => {
 *     console.log('Ready!');
 * });
 * ```
 */
export class Espresso {
    private _target: Express;
    private _onError: ErrorCallback[];
    private _options: EspressoOptions;

    /**
     * Create an instance of Espresso
     * ```
     * @param target An `express.js` instance target.
     * @param options An options object about how to inject the routes.
     */
    constructor(target: Express, options?: Partial<EspressoOptions>) {
        this._target = target;
        this._onError = [];
        this._options = {
            lowercase:  options?.lowercase  ?? false,
            verbose:    options?.verbose    ?? false,
        };
    }

    private _verbose(flat: FlattedRoute, ok?: boolean): void {
        if (!this._options.verbose) { return; }

        const method = `"${flat.method.toUpperCase()}";`.padEnd(11, ' ');
        process.stdout.write(
                `    • [${ok ? 'OK' : '  '}] Inject Method: ${method}`
            +   `path: "${flat.path}"${ok ? '\n' : '\r'}`
        );
    }

    /**
     * Injects to the `express.js` target instance all endpoints descendants of
     * the API root routing class.
     * @param route The root routing class of your API Rest.
     */
    inject(route: ControllerRoutingClass): void {
        if (this._options.verbose) {
            console.log(`>>@bleed-believer/espresso:`);
            console.log(`  - Begin routing injection into express.js instance...`);
        }

        const flatted = flattenRoutes(route, this._options.lowercase);
        for (const route of flatted) {
            this._verbose(route);

            this._target[route.method](route.path, async (req, res) => {
                try {
                    // Create an instance and execute the command
                    const obj = new route.class(req, res) as any;
                    await obj[route.key]();
                } catch (err) {
                    if (this._onError.length) {
                        // Use the setted callback
                        for (const callback of this._onError) {
                            await callback(err, req, res);
                        }
                    } else {
                        // Propagate the error
                        throw err;
                    }
                }
            });
            
            this._verbose(route, true);
        }

        this._options.verbose &&
        console.log(`  - Routing injection completed!\n`);
    }

    /**
     * Binds a function to the event manager for endpoint errors handling.
     * @param callback The function to bind to.
     */
    onError(callback: ErrorCallback): void {
        this._onError.push(callback);
    }

    /**
     * Unbinds a function from the event manager for endpoint errors handling.
     * @param callback The function to unbind from.
     */
    offError(callback: ErrorCallback): void {
        const i = this._onError.findIndex(x => x === callback);
        if (i >= 0) {
            this._onError.splice(i, 1);
        }
    }
}
