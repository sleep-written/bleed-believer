import { ClassMeta } from '@bleed-believer/core';

import { CommandMeta } from '../../decorators/command/command.meta';
import { ArgsParser } from '../../tool/args-parser';
import { Action } from '../../interfaces';
import { Fail } from '../../interfaces/fail';

export interface CommandRouterMeta {
    queue: ClassMeta<CommandMeta>[];    
    args: ArgsParser;

    before?: Action;
    after?: Action;
    error?: Fail;
    multi?: boolean;
}
