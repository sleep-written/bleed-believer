import { Meta } from '@bleed-believer/meta';

import { CommandMeta } from './command.meta';
import { CommandOptions } from './command.options';
import { CommandDecorator } from './command.decorator';
import { ArgvParser } from '../argv';

export const COMMAND = new Meta<CommandMeta>();
export function Command(options: CommandOptions): CommandDecorator {
    return target => {
        const meta: CommandMeta = {
            name: options.name,
            main: ArgvParser.parsePattern(options.main),
            info: options.info ?? 'Description not provided.'
        }
        
        COMMAND.set(target, meta);
    };
}
