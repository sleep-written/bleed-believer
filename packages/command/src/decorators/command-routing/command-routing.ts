import { CommandRoutingDecorator } from './command-routing.decorator';
import { CommandRoutingOptions } from './command-routing.options';
import { CommandRoutingMeta } from './command-routing.meta';
import { COMMAND_META } from '../command';

import { ClassMeta, Executable } from '../../interfaces';
import { MetaManager } from '../../tool/meta-manager';
import { ArgParser } from '../../tool/arg-parser';

export const COMMAND_ROUTING_META = Symbol('@bleed-believer/command-routing');
export function CommandRouting(options: CommandRoutingOptions): CommandRoutingDecorator {
    const meta: CommandRoutingMeta = {
        main: [],
        commands : [],
    };

    if (options instanceof Array) {
        meta.commands = [...options];
    } else {
        meta.main = ArgParser.parseMain((options as any)?.main as string);
        meta.commands = ((options as any).commands as ClassMeta<Executable>[])
            .filter(x => {
            const manag = new MetaManager(x);
            return manag.some(COMMAND_META)
        });
    }

    return o => {
        const manag = new MetaManager(o);
        manag.set(COMMAND_ROUTING_META, meta);
    };
}
