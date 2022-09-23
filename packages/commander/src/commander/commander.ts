import { MetaManager } from '@bleed-believer/meta';

import type { CommandRoutingClass } from '../command-routing/index.js';
import type { ParserOptions } from '../argv-parser/index.js';
import type { CommanderMeta } from './commander.meta.js';

import { CommandNotFoundError, DuplicatedInstanceError } from './errors/index.js';
import { flattenRoute } from '../flatten-route/index.js';
import { ArgvParser } from '../argv-parser/index.js';

import { GET_ARGV_DATA } from '../get-argv-data/index.js';
import { GET_ARGV } from '../get-argv/index.js';

export const COMMANDER = new MetaManager<CommanderMeta>();

/**
 * A class to deploy Command Routing classes and executes Command classes.
 */
export class Commander {
    #main: CommandRoutingClass;
    #opts: ParserOptions;

    /**
     * Creates a new Commander instance.
     * @param target The Command Routing class do you want to deploy.
     * @param options Options about the behavior of the execution argument parser.
     */
    constructor(
        target: CommandRoutingClass,
        options?: ParserOptions
    ) {
        // Sets the options
        this.#main = target;
        this.#opts = {
            linear:     options?.linear     ?? false,
            lowercase:  options?.lowercase  ?? false,
        };

        // Overwrite the metadata
        const meta = COMMANDER.get(Commander);
        if (meta?.instantiated) {
            throw new DuplicatedInstanceError();
        } else {
            COMMANDER.set(Commander, {
                instantiated: true,
                rawArgv: meta.rawArgv
            });
        }

    }

    /**
     * Deploys the target Command Routing class and searches inside of the target,
     * the Command class according the execution arguments.
     */
    async execute(): Promise<void> {
        // Create the ArgvParser
        const meta = COMMANDER.get(Commander);
        const argv = new ArgvParser(
            meta.rawArgv,
            this.#opts
        );
        
        // Add Argv to the Commander Metadata
        GET_ARGV.set(Commander, {
            main: argv.main,
            flags: argv.flags,
        });

        // Find a result
        const flattened = flattenRoute(this.#main);
        const flat = flattened.find(x => {
            const data = argv.match(x.path);
            if (data) {
                GET_ARGV_DATA.set(Commander, {
                    items: [ ...data.items ],
                    param: { ...data.param }
                });
            }
            return !!data;
        });
        
        // Command not found
        if (!flat) {
            throw new CommandNotFoundError();
        }

        // Create route instances
        const routes = flat.routings.map(x => new x());
        const routesRev = [...routes].reverse();
        
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
            const route = routesRev.find(x => !!x.failed);
            if (route?.failed) {
                // Execute all available "failed" functions
                await route.failed(err);
            } else {
                // Launch a global error
                throw err;
            }
        }
    }
}

// Set the default metadata
COMMANDER.set(Commander, {
    instantiated: false,
    rawArgv: process.argv.slice(2)
});
