import type { CommandRoutingClass } from '../../command-routing/index.js';
import type { CommandClass } from '../../command/index.js';

export interface FlattenedCommand {
    path: string[];
    command: CommandClass;
    routings: CommandRoutingClass[];
}