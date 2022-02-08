import { ClassMeta } from '@bleed-believer/meta';

import { ArgvData, CommandRoute, Executable } from '../interfaces';
import { ArgParser, ParserOptions } from '../tool/arg-parser';
import { COMMAND_ROUTING } from '../decorators';
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

    private async _resolveCommand(
        classCommand: ClassMeta<Executable>,
        data: ArgvData
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

            if (obj.after) {
                await obj.after(this._argv);
            }
        } else {
            throw error;
        }
    }

    private _search(
        route: ClassMeta<CommandRoute>,
        argv: ArgParser
    ): null | {
        command: ClassMeta<Executable>,
        data: ArgvData
    } {
        const meta = COMMAND_ROUTING.get(route);
        const routeChecker = new CheckRoute(argv);

        for (const innerRoute of meta.routes) {
            const match = routeChecker.eval(innerRoute);
            if (!match) { continue; }

            const innerArgv = new ArgParser(match, this._argv.options);
            const resp = this._search(innerRoute, innerArgv);
            if (resp) {
                return resp;
            }
        }

        const commandChecker = new CheckCommand(argv);
        for (const command of meta.commands) {
            const data = commandChecker.eval(command);
            if (data) {
                return { command, data };
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