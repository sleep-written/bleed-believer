import { CommandMeta, CommandRoutingMeta, COMMAND_META, COMMAND_ROUTING_META } from '../decorators';
import { ClassMeta, CommandRoute, Executable } from '../interfaces';
import { ArgParser, ParserOptions } from '../tool/arg-parser';
import { MetaManager } from '../tool/meta-manager';
import { CheckCommand } from './check-command';
import { CheckRoute } from './check-route';

export class Commander {
    private _route: ClassMeta<CommandRoute>;
    private _argv: ArgParser;

    constructor(route: ClassMeta<CommandRoute>, options?: ParserOptions) {
        this._route = route;
        this._argv = new ArgParser(
            process.argv.slice(2),
            options
        );
    }

    private _getRouteMeta(route: ClassMeta<CommandRoute>): CommandRoutingMeta {
        const mana = new MetaManager(route);
        return mana.get<CommandRoutingMeta>(COMMAND_ROUTING_META);
    }

    private async _resolveCommand(
        classCommand: ClassMeta<Executable>,
        data: Record<string, string[]>
    ): Promise<void> {
        const route = new this._route();
        const command = new classCommand();

        try {
            if (route?.before) {
                await route.before(this._argv);
            }

            await command.start(this._argv, data);

            if (route?.after) {
                await route.after(this._argv);
            }
        } catch (err: any) {
            if (route?.failed) {
                await route.failed(err);
            } else {
                throw new Error(err);
            }
        }
    }

    private async _rejectCommand(): Promise<void> {
        const error = new Error('Command not found.');
        
        // Execute the before command
        const obj = new this._route();
        if (obj.before) {
            await obj.before(this._argv);
        }

        if (obj.failed) {
            await obj.failed(error);
        } else {
            throw error;
        }

        if (obj.after) {
            await obj.after(this._argv);
        }
    }

    private _search(
        route: ClassMeta<CommandRoute>,
        argv: ArgParser
    ): null | {
        command: ClassMeta<Executable>,
        data: Record<string, string[]>
    } {
        const mainMeta = this._getRouteMeta(route);
        const routeChecker = new CheckRoute(argv);

        for (const mainRoute of mainMeta.routes) {
            const match = routeChecker.eval(mainRoute);
            if (!match) { continue; }

            const innerArgv = new ArgParser(match, this._argv.options);
            const innerMeta = this._getRouteMeta(mainRoute);

            for (const innerRoute of innerMeta.routes) {
                const command = this._search(innerRoute, innerArgv);
                if (command) { return command; }
            }

            const commandChecker = new CheckCommand(innerArgv);
            for (const command of innerMeta.commands) {
                const data = commandChecker.eval(command);
                if (data) {
                    return {
                        command,
                        data
                    };
                }
            }
        }

        return null;
    }

    execute(): Promise<void> {
        const found = this._search(
            this._route,
            this._argv
        );

        if (found) {
            return this._resolveCommand(
                found.command,
                found.data
            );
        } else {

        }

        return this._rejectCommand();
    }
}