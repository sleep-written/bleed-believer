import { Argv, ArgvData, ArgvParser, ParserOptions } from './argv-parser/index.js';
import { CommandRoutingClass } from './command-routing/index.js';
import { flattenRoute } from './flatten-route/index.js';

export class Commander {
    private _main: CommandRoutingClass;
    
    private _argv: ArgvParser;
    get argv(): Argv {
        return {
            main: this._argv.main,
            data: this._argv.data,
        };
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
        this._argv = new ArgvParser(
            process.argv.slice(2),
            options
        );
    }

    async initialize(): Promise<void> {
        const flattened = flattenRoute(this._main);
        const flat = flattened.find(x => {
            const data = this._argv.match(x.path);
            if (data) { this._data = data; }
            return !!data;
        });
        
        if (!flat) {
            throw new Error('TODO: Create an error for "command not found"');
        }

        // Create route instances
        const routes = flat.routings.map(x => new x());
        const routesRev = routes.slice().reverse();

        try {
            // Execute all available "before" functions
            for (const route of routes) {
                route.before &&
                await route.before();
            }

            // Execute the command
            const cmd = new flat.command();
            await cmd.start();

            // Execute all available "after" functions
            for (const route of routesRev) {
                route.after &&
                await route.after();
            }
        } catch (err: any) {
            // Execute all available "failed" functions
            const route = routesRev.find(x => !!x.failed);
            if (route?.failed) {
                await route.failed(err);
            } else {
                throw err;
            }
        }
    }
}
