import { ClassMeta, Action } from "../../interfaces";
import { BleedModuleMeta } from "../../decorators/bleed-module/bleed-module.meta";
import { CommandMeta } from "../../decorators/command/command.meta";
import { Args } from "../../tool/args/args";

export interface CommandRouterMeta extends BleedModuleMeta {
    queue: ClassMeta<CommandMeta>[];    
    args: Args;

    notFound?: Action;
    before?: Action;
    after?: Action;
}
