import { CommandMeta } from '../../decorators/command/command.meta';
import { ClassMeta, Action } from '../../interfaces';

export interface CommandRouterOptions {
    notFound?: Action;
    commands: ClassMeta<CommandMeta>[];
    before?: Action;
    after?: Action;
}
