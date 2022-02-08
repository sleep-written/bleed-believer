import { MetaManager } from '@bleed-believer/meta';

import { CommandRoutingDecorator } from './command-routing.decorator';
import { CommandRoutingOptions } from './command-routing.options';
import { CommandRoutingMeta } from './command-routing.meta';

import { ArgParser } from '../../tool/arg-parser';
import { COMMAND } from '../command';

export const COMMAND_ROUTING = new MetaManager<CommandRoutingMeta>(
    '@bleed-believer/command-routing'
);

export function CommandRouting(options: CommandRoutingOptions): CommandRoutingDecorator {
    const meta: CommandRoutingMeta = {
        main: [],
        routes: [],
        commands : [],
    };

    // Get main pattern
    meta.main = options.main ? ArgParser.parseMain(options.main): [];
    meta.routes = options?.routes?.filter(x => COMMAND_ROUTING.some(x))?? [];
    meta.commands = options?.commands?.filter(x => COMMAND.some(x)) ?? [];

    // Check main arg
    for (const item of meta.main) {
        if (item.startsWith('...')) {
            throw new Error(
                    'the wildcard "..." is not '
                +   'allowed in command routes.'
            );
        } else if (item.startsWith(':')) {
            throw new Error(
                    'the wildcard ":" is not '
                +   'allowed in command routes.'
            );
        }
    }

    return o => {
        COMMAND_ROUTING.set(o, meta);
    };
}
