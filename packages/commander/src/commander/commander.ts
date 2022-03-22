import { Argv, ArgvData, ArgvParser, ParserOptions } from '../argv';
import { CommandRoutingClass } from '../interfaces';
import { commandFlatter } from './command-flatter';
import { CommandFlatted } from './interfaces';

export class Commander {
    private _root: CommandRoutingClass;
    private _argv: ArgvParser;

    /**
     * A class that initializes the route that you pass as argument.
     * @param route The root `CommandRouting` of your application.
     * @param options The options to change the behavior of the commander instance.
     */
    constructor(route: CommandRoutingClass, options?: ParserOptions) {
        this._root = route;
        this._argv = new ArgvParser(
            process.argv.slice(2),
            {...options}
        );
    }

    async #execute(flat: CommandFlatted, argv: Argv, data: ArgvData): Promise<void> {
        // Prepare execution
        const routes = flat.routes.map(x => new x());

        try {
            // Execute all "before" routes method
            for (const route of routes.slice().reverse()) {
                if (route.before && !(route instanceof this._root)) {
                    await route.before(argv);
                }
            }

            // Execute the command
            const command = new flat.command();
            await command.start(argv, data);
        } catch (err) {
            // Execute "failed" routes method
            for (const route of routes) {
                if (route.failed) {
                    await route.failed(err);
                    return;
                }
            }

            // Only if a "failed" method not found
            throw err;
        } finally {
            // Execute all "after" routes method
            for (const route of routes) {
                if (route.after && !(route instanceof this._root)) {
                    await route.after(argv);
                }
            }
        }
    }

    /**
     * Searches the `Command` class using the __execution arguments__ as reference.
     * If the `Command` class is found, that class is instanciated and launchs its
     * `start(...)` method.
     */
    async execute(): Promise<void> {
        const route = new this._root();
        const argv: Argv = {
            main: this._argv.main,
            data: this._argv.data
        };

        try {
            // Execute the root's "before" event
            if (route.before) {
                await route.before(argv);
            }

            // Flatter the command's path
            const flattedCommands = commandFlatter(this._root);
            let found = false;


            for (const flat of flattedCommands) {
                // Comparte the pattern with argv
                const data = this._argv.match(flat.main);                 
                if (data) {
                    // Execute the command
                    await this.#execute(flat, argv, data);
                    found = true;
                    break;
                }
            }

            // Trigger an error when command not found
            if (!found) {
                throw new Error('Command not found.');
            }
        } catch (err: any) {
            // Use the "failed" root route event
            if (route.failed) {
                await route.failed(err);
            } else {
                throw err;
            }
        } finally {
            // Use the "after" root route event
            if (route.after) {
                await route.after(argv);
            }
        }
    }
}
