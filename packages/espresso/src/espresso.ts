import { Express } from 'express';
import { ErrorCallback } from './interfaces';

import { flattenRoutes } from './flattern-routes';
import { ControllerRoutingClass } from './controller-routing';

export class Espresso {
    private _app: Express;
    private _onError: ErrorCallback[];

    constructor(app: Express) {
        this._app = app;
        this._onError = [];
    }

    inject(route: ControllerRoutingClass): void {
        const flatted = flattenRoutes(route);
        for (const route of flatted) {
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
        }
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
