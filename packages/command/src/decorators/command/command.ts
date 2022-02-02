import { MetaManager } from '../../tool/meta-manager';

import { CommandMeta } from './command.meta';
import { CommandOptions } from './command.options';
import { CommandDecorator } from './command.decorator';

export const COMMAND_META = Symbol('@bleed-believer/command');
export function Command(options: CommandOptions): CommandDecorator {
    if (!options.info) {
        options.info = 'Not available.';
    }
    
    const main: string[] = options.main
        .map(x => x?.replace(/[^a-z0-9:\-_]/gi, ''))
        .filter(x => typeof x === 'string' && !!x);

    return o => {
        const manager = new MetaManager(o);
        manager.set<CommandMeta>(COMMAND_META, {
            main,
            name: options.name,
            info: options.info as string
        });
    };
}