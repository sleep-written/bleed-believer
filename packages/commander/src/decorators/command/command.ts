import { MetaManager } from '@bleed-believer/meta';

import { ArgParser } from '../../tool/arg-parser';
import { CommandMeta } from './command.meta';
import { CommandOptions } from './command.options';
import { CommandDecorator } from './command.decorator';

export const COMMAND = new MetaManager<CommandMeta>(
    '@bleed-believer/command'
);

export function Command(options: CommandOptions): CommandDecorator {
    if (!options.info) {
        options.info = 'Not available.';
    }

    const main: string[] = ArgParser.parseMain(options.main);
    return o => {
        COMMAND.set(o, {
            main,
            name: options.name,
            info: options.info as string
        })
    };
}