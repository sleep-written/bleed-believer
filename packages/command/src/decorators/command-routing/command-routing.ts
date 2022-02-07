import { CommandRoutingDecorator } from './command-routing.decorator';
import { CommandRoutingOptions } from './command-routing.options';
import { CommandRoutingMeta } from './command-routing.meta';
import { COMMAND_META } from '../command';

import { ClassMeta, CommandRoute, Executable } from '../../interfaces';
import { MetaManager } from '../../tool/meta-manager';
import { ArgParser } from '../../tool/arg-parser';

export const COMMAND_ROUTING_META = Symbol('@bleed-believer/command-routing');
export function CommandRouting(options: CommandRoutingOptions): CommandRoutingDecorator {
    const meta: CommandRoutingMeta = {
        main: [],
        routes: [],
        commands : [],
    };

    // Get main pattern
    meta.main = options.main ? ArgParser.parseMain(options.main): [];

    // Get routes
    meta.routes = ((options as any).commands as ClassMeta<CommandRoute>[])
        .filter(x => {
            const manag = new MetaManager(x);
            return manag.some(COMMAND_ROUTING_META);
        });

    // Get commands
    meta.commands = ((options as any).commands as ClassMeta<Executable>[])
        .filter(x => {
            const manag = new MetaManager(x);
            return manag.some(COMMAND_META);
        });

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
        const manag = new MetaManager(o);
        manag.set(COMMAND_ROUTING_META, meta);
    };
}
