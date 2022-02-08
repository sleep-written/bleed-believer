import { ClassMeta } from '@bleed-believer/meta';

import { COMMAND_ROUTING } from '../decorators';
import { CommandRoute } from '../interfaces';
import { ArgParser } from '../tool/arg-parser';

export class CheckRoute {
    private _user: string[];
    private _toLower: boolean;

    constructor(
        argv: ArgParser,
    ) {
        this._user = argv.main;
        this._toLower = argv.options.lowercase;
    }

    eval(route: ClassMeta<CommandRoute>): string[] | null {
        const meta = COMMAND_ROUTING.get(route);

        const argsTemp: string[] = [...meta.main];
        const argsUser: string[] = [...this._user];

        if (argsTemp.length > argsUser.length) {
            return null;
        }

        while (argsTemp.length > 0) {
            let temp = argsTemp.shift() ?? '';
            let user = argsUser.shift() ?? '';

            if (this._toLower) {
                temp = temp.toLowerCase();
                user = user.toLowerCase();
            }

            if (temp !== user) {
                return null;
            }
        }

        return argsUser;
    }
}