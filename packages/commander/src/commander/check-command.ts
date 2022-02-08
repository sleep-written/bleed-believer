import { ClassMeta } from '@bleed-believer/meta';

import { ArgvData, Executable } from '../interfaces';
import { ArgParser } from '../tool/arg-parser';
import { COMMAND } from '../decorators';

export class CheckCommand {
    private _mainUser: string[];
    private _toLower: boolean;

    constructor(
        argv: ArgParser,
    ) {
        this._toLower = argv.options.lowercase;
        this._mainUser = argv.main;
    }

    eval(command: ClassMeta<Executable>): ArgvData | null {
        const meta = COMMAND.get(command);
        const mainTemp = [...meta.main];
        const mainUser = [...this._mainUser];

        const last = mainTemp[mainTemp.length - 1];
        if (last?.startsWith('...')) {
            const t = mainTemp.length;
            const u = mainUser.length;

            if (t - 1 > u) {
                return null;
            }
        } else if (mainTemp.length > mainUser.length) {
            return null;
        }
        
        const data: ArgvData = {};
        while (mainTemp.length > 0) {
            let temp = mainTemp.shift();
            let user = mainUser.shift();

            if (temp?.startsWith(':')) {
                // Key/Value pair
                const key =( this._toLower
                    ? temp.toLowerCase()
                    : temp)
                    .replace(/^:/gi, '');

                if (!data.param) {
                    data.param = {};
                }

                if (user) {
                    data.param[key] = user;
                }

            } else if (
                (temp?.startsWith('...')) &&
                (mainTemp.length === 0)
            ) {
                if (!data.items) {
                    data.items = [];
                }

                if (user) {
                    data.items.push(user, ...mainUser);
                }

            } else {
                // Equality
                if (this._toLower) {
                    temp = temp?.toLowerCase();
                    user = user?.toLowerCase();
                }

                if (temp !== user) {
                    return null;
                }
            }
        }

        return data;
    }
}