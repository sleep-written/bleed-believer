import { CommandRoutingClass } from '../../command-routing/index.js';
import { CommandClass } from '../../command/index.js';

export interface FlattenedCommand {
    path: string[];
    command: CommandClass;
    routings: CommandRoutingClass[];
}