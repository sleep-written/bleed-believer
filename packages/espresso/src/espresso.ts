import { Express } from 'express';
import { ErrorCallback, EspressoOptions } from './interfaces';

import { FlattedRoute, flattenRoutes } from './flattern-routes';
import { ControllerRoutingClass } from './controller-routing';

export class Espresso {
    private _app: Express;
    private _onError: ErrorCallback[];
    private _options: EspressoOptions;

    constructor(app: Express, options?: Partial<EspressoOptions>) {
        this._app = app;
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

    inject(route: ControllerRoutingClass): void {
        if (this._options.verbose) {
            console.log(`>>@bleed-believer/espresso:`);
            console.log(`  - Begin routing injection into express.js instance...`);
        }

        const flatted = flattenRoutes(route, this._options.lowercase);
        for (const route of flatted) {
            this._verbose(route);

            this._app[route.method](route.path, async (req, res) => {
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

    onError(callback: ErrorCallback): void {
        this._onError.push(callback);
    }

    offError(callback: ErrorCallback): void {
        const i = this._onError.findIndex(x => x === callback);
        if (i >= 0) {
            this._onError.splice(i, 1);
        }
    }
}
