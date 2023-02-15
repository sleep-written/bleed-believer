import type { CommandClass } from '../../command/interfaces/index.js';
import type { CommandRoutingClass } from './command-routing.class.js';

export interface CommandRoutingMeta {
    path: string[];
    commands: CommandClass[];
    routings: CommandRoutingClass[];
}
