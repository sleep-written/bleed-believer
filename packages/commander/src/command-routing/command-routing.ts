import { Meta } from '@bleed-believer/meta';
import { ArgvParser } from '../argv';
import { CommandRoutingDecorator } from './command-routing.decorator';
import { CommandRoutingMeta } from './command-routing.meta';
import { CommandRoutingOptions } from './command-routing.options';

export const COMMAND_ROUTING = new Meta<CommandRoutingMeta>();
export function CommandRouting(options: CommandRoutingOptions): CommandRoutingDecorator {
    return target => {
        const meta: CommandRoutingMeta = {
            main: ArgvParser.parsePattern(options.main ?? ''),
            routes: options.routes ?? [],
            commands: options.commands ?? [],
        };

        COMMAND_ROUTING.set(target, meta);
    };
}
