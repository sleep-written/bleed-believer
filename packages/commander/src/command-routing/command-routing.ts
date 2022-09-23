import { MetaManager } from '@bleed-believer/meta';
import { ArgvParser } from '../argv-parser/index.js';

import type {
    CommandRoutingDecorator,
    CommandRoutingOptions,
    CommandRoutingMeta,
} from './interfaces/index.js';

export const COMMAND_ROUTING = new MetaManager<
    CommandRoutingMeta
>('@bleed-believer/commander:command-route');

/**
 * A decorator de transform classes to a Command Routing class.
 * @param options The options to define the routings of the class.
 */
export function CommandRouting(options: CommandRoutingOptions): CommandRoutingDecorator {
    return target => {
        COMMAND_ROUTING.set(target, {
            commands: (options as any).commands ?? [],
            routings: (options as any).routings ?? [],
            path:   typeof options.path === 'string'
                ?   ArgvParser.parsePattern(options.path)
                :   []
        });
    };
}
