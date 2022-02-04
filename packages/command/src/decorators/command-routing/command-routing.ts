import { MetaManager } from '../../tool/meta-manager';
import { ClassMeta, CommandRoute, Executable } from '../../interfaces';

import { ArgParser } from 'command/src/tool/arg-parser';
import { CommandRoutingMeta } from './command-routing.meta';
import { CommandRoutingOptions } from './command-routing.options';
import { CommandRoutingDecorator } from './command-routing.decorator';

import { COMMAND_META } from '../command';

export const COMMAND_ROUTING = Symbol('@bleed-believer/command-routing');

export function CommandRouting(commands: (
    ClassMeta<Executable> |
    ClassMeta<CommandRoute>
)[]): CommandRoutingDecorator;

export function CommandRouting(
    options: CommandRoutingOptions
): CommandRoutingDecorator;

export function CommandRouting(
    arg:
        CommandRoutingOptions |
        (
            ClassMeta<Executable> |
            ClassMeta<CommandRoute>
        )[]
): CommandRoutingDecorator {
    const meta: CommandRoutingMeta = {
        path: [],
        routes: [],
        commands: []
    };

    if (arg instanceof Array) {
        meta.routes = (arg as any[]).filter(x => {
            const mmm = new MetaManager(x);
            return !!mmm.some(COMMAND_ROUTING);
        });

        meta.commands = (arg as any[]).filter(x => {
            const mmm = new MetaManager(x);
            return !!mmm.some(COMMAND_META);
        });
    } else {
        if (arg.path) {
            meta.path = ArgParser.parseMain(arg.path);
        }

        meta.routes = (arg.attach as any[]).filter(x => {
            const mmm = new MetaManager(x);
            return !!mmm.some(COMMAND_ROUTING);
        });

        meta.commands = (arg.attach as any[]).filter(x => {
            const mmm = new MetaManager(x);
            return !!mmm.some(COMMAND_META);
        });
    }

    return o => {
        const manager = new MetaManager(o);
        manager.set<CommandRoutingMeta>(COMMAND_ROUTING, meta);
    };
}