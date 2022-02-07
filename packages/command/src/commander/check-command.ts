import { CommandMeta, COMMAND_META } from '../decorators';
import { ClassMeta, Executable } from '../interfaces';

import { MetaManager } from '../tool/meta-manager';
import { ArgParser } from '../tool/arg-parser';

export class CheckCommand {
    private _mainUser: string[];
    private _toLower: boolean;

    constructor(
        argv: ArgParser,
    ) {
        this._toLower = argv.options.lowercase;
        this._mainUser = argv.main;
    }

    eval(command: ClassMeta<Executable>): Record<string, string[]> | null {
        const mana = new MetaManager(command);
        const meta = mana.get<CommandMeta>(COMMAND_META);

        const mainTemp = [...meta.main];
        const mainUser = [...this._mainUser];

        if (mainTemp.length > mainUser.length) {
            return null;
        }
        
        const data: Record<string, string[]> = {};
        while (mainTemp.length > 0) {
            let temp = mainTemp.shift() ?? '';
            let user = mainUser.shift() ?? '';

            if (temp.startsWith(':')) {
                // Key/Value pair
                const key = this._toLower
                    ? temp.toLowerCase()
                    : temp;

                if (!data[key]) {
                    data[key] = [user];
                } else {
                    data[key].push(user);
                }

            } else if (
                (temp.startsWith('...')) &&
                (mainTemp.length === 0)
            ) {
                // Array at the end
                const key = this._toLower
                    ? temp.toLowerCase()
                    : temp;

                if (!data[key]) {
                    data[key] = [user, ...mainUser];
                } else {
                    data[key].push(user, ...mainUser);
                }

            } else {
                // Equality
                if (this._toLower) {
                    temp = temp.toLowerCase();
                    user = user.toLowerCase();
                }

                if (temp !== user) {
                    return null;
                }
            }
        }

        return data;
    }
}