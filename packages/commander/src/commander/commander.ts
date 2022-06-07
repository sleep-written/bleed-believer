import { Argv, ArgvData, ArgvParser, ParserOptions } from '../argv-parser/index.js';
import { CommandRoutingClass } from '../command-routing/index.js';
import { flattenRoute } from '../flatten-route/index.js';

import { GET_ARGV_DATA } from '../get-argv-data/get-argv-data.js';
import { GET_ARGV } from '../get-argv/get-argv.js';

export class Commander {
    private _main: CommandRoutingClass;
    private _opts: ParserOptions;
    
    private _argv!: ArgvParser;
    get argv(): Argv {
        if (!this._argv) {
            throw new Error('TODO: Create a custom error for not initialized.');
        } else {
            return {
                main: this._argv.main,
                flags: this._argv.flags,
            };
        }
    }

    private _data!: ArgvData;
    get argvData(): ArgvData {
        if (!this._data) {
            throw new Error('TODO: Create a custom error for not initialized.');
        } else {
            return this._data;
        }
    }

    constructor(
        mainRoute: CommandRoutingClass,
        options?: ParserOptions
    ) {
        this._main = mainRoute;
        this._opts = {
            linear:     options?.linear     ?? false,
            lowercase:  options?.lowercase  ?? false,
        };
    }

    async initialize(): Promise<void> {
        this._argv = new ArgvParser(
            process.argv.slice(2),
            this._opts
        );

        const flattened = flattenRoute(this._main);
        const flat = flattened.find(x => {
            const data = this._argv.match(x.path);
            if (data) {
                this._data = data;

                GET_ARGV.set(Commander, {
                    main: this._argv.main,
                    flags: this._argv.flags,
                });

                GET_ARGV_DATA.set(Commander, {
                    items: [ ...data.items ],
                    param: { ...data.param }
                });
            }
            return !!data;
        });
        
        if (!flat) {
            throw new Error('TODO: Create an error for "command not found"');
        }

        // Create route instances
        const routes = flat.routings.map(x => new x());
        
        try {
            // Execute all available "before" functions
            for (const route of routes) {
                route.before &&
                await route.before();
            }

            // Execute the command
            routes.reverse();
            const cmd = new flat.command();
            await cmd.start();

            // Execute all available "after" functions
            for (const route of routes) {
                route.after &&
                await route.after();
            }
        } catch (err: any) {
            // Execute all available "failed" functions
            const route = routes.find(x => !!x.failed);
            if (route?.failed) {
                await route.failed(err);
            } else {
                throw err;
            }
        } finally {
            return;
        }
    }
}
