import type { Express, Response, IRouterHandler } from 'express';
import type { ControllerRoutingClass } from './controller-routing/index.js';
import type { EspressoOptions } from './interfaces/index.js';
import type { FlattedRoute } from './flattern-routes/index.js';

import { CONTROLLER_ROUTING } from './controller-routing/index.js';
import { flattenRoutes } from './flattern-routes/index.js';
import { EndpointError } from './endpoint.error.js';
import express from 'express';

type ErrorListener = (err: EndpointError, res: Response) => any | Promise<any>;
type Middleware = Parameters<IRouterHandler<any>>[0];
type Server = ReturnType<Express['listen']>;

/**
 * The `Espresso` class is a lightweight framework for configuring an Express.js server
 * with controller-based routing and error handling. It enables modular integration of
 * routing classes, custom error listeners, middleware, and streamlined server management.
 */
export class Espresso {
    #errorListeners: ErrorListener[] = [];
    #options: EspressoOptions;
    #server?: Server;
    #app: Express;

    /**
     * Initializes an `Espresso` instance with optional configuration settings.
     * 
     * @param options - Optional settings of type `EspressoOptions`.
     */
    constructor(options?: Partial<EspressoOptions>) {
        this.#options = {
            lowercase: !!options?.lowercase,
            verbose: !!options?.verbose,
        };
        this.#app = express();
    }

    #verbose(flat: FlattedRoute, ok?: boolean): void {
        const method = `"${flat.method.toUpperCase()}";`.padEnd(11, ' ');
        process.stdout.write(
                `    • [${ok ? 'OK' : '  '}] Inject Method: ${method}`
            +   `path: "${flat.path}"${ok ? '\n' : '\r'}`
        );
    }

    /**
     * Flattens the routes defined in a `ControllerRoutingClass` and injects them into
     * the Express instance, associating each endpoint with its HTTP method and path.
     * Routes are registered with error handling logic that triggers either custom listeners
     * or a default HTML error response.
     * 
     * @param routeClass - The root `ControllerRoutingClass` for the REST API.
     */
    #injectRoutes(routeClass: ControllerRoutingClass): void {
        if (this.#options.verbose) {
            console.log(`>>@bleed-believer/espresso:`);
            console.log(`  - Begin routing injection into express.js instance...`);
        }

        const flattedRoutes = flattenRoutes(routeClass, this.#options.lowercase);
        for (const flattedRoute of flattedRoutes) {
            this.#options.verbose &&
            this.#verbose(flattedRoute);

            this.#app[flattedRoute.method](flattedRoute.path, async (req, res) => {
                try {
                    // Create an instance of the controller class and execute the endpoint method
                    const controllerInstance = new flattedRoute.class(req, res) as any;
                    await controllerInstance[flattedRoute.key]();
                } catch (err: any) {
                    if (this.#errorListeners.length) {
                        if (!(err instanceof EndpointError)) {
                            err = new EndpointError(err);
                        }

                        for (const listener of this.#errorListeners) {
                            await listener(err, res);
                        }
                    } else {
                        const endpointError = new EndpointError(err);
                        res
                            .contentType('html')
                            .status(endpointError.status)
                            .end(endpointError.toString());
                    }
                }
            });

            this.#options.verbose &&
            this.#verbose(flattedRoute, true);
        }

        this.#options.verbose &&
        console.log(`  - Routing injection completed!\n`);
    }

    /**
     * Adds a listener to handle unhandled endpoint errors. These listeners can perform
     * custom logging or modify the response before sending it to the client.
     * 
     * @param listener - Callback invoked with the `EndpointError` and Express `Response`.
     * @returns The current `Espresso` instance for chaining.
     */
    onError(listener: ErrorListener): this {
        this.#errorListeners.push(listener);
        return this;
    }

    /**
     * Removes a specific error listener, or clears all listeners if none is specified.
     * 
     * @param listener - Specific listener to remove; if omitted, all listeners are removed.
     * @returns The current `Espresso` instance for chaining.
     */
    offError(listener?: ErrorListener): this {
        if (listener) {
            const index = this.#errorListeners.findIndex(x => x === listener);
            if (index >= 0) {
                this.#errorListeners.splice(index, 1);
            }
        } else {
            this.#errorListeners = [];
        }

        return this;
    }

    /**
     * Registers middlewares or routing classes with the Express application.
     * `ControllerRoutingClass` instances have their routes injected, while middleware
     * is applied directly to the app via `app.use()`.
     * 
     * @param input - Array of middlewares or `ControllerRoutingClass` instances.
     * @returns The current `Espresso` instance for chaining.
     */
    use(...input: (Middleware | ControllerRoutingClass)[]): this {
        for (const item of input) {
            const meta = CONTROLLER_ROUTING.get(item, true);
            if (meta) {
                // If it's a routing class, inject its routes into the Express app
                this.#injectRoutes(item as ControllerRoutingClass);
            } else {
                // If it's a middleware, use it with the Express app
                this.#app.use(item as Middleware);
            }
        }

        return this;
    }

    /**
     * Starts the server on the specified port and optional hostname, returning a promise
     * that resolves with the server instance.
     * 
     * @param port - Port for the server to listen on.
     * @param hostname - Optional hostname or IP to bind to.
     * @returns A promise that resolves with the `Server` instance.
     */
    listen(port: number, hostname?: string): Promise<Server> {
        return new Promise<Server>((resolve, reject) => {
            try {
                const server = hostname
                    ? this.#app.listen(port, hostname, () => {
                        this.#server = server;
                        server.once('close', () => {
                            this.#server = undefined;
                        });
                        resolve(server);
                    })
                    : this.#app.listen(port, () => {
                        this.#server = server;
                        server.once('close', () => {
                            this.#server = undefined;
                        });
                        resolve(server);
                    });

                // Handle server errors that occur during startup
                server.on('error', (err: Error) => {
                    this.#server?.close();
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
