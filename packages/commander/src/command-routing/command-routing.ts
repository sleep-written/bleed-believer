import { Meta } from '@bleed-believer/meta';
import { ArgvParser } from '../argv';
import { CommandRoutingDecorator } from './command-routing.decorator';
import { CommandRoutingMeta } from './command-routing.meta';
import { CommandRoutingOptions } from './command-routing.options';

export const COMMAND_ROUTING = new Meta<CommandRoutingMeta>();

/**
 * Converts a class into a `CommandRouter` class type.
 * @param options The options required to configure the current target.
 */
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
