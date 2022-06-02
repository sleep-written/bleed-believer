import { CommandClass } from '../../command/interfaces/index.js';
import { CommandRoutingClass } from './command-routing.class.js';

export interface CommandRoutingMeta {
    path: string[];
    commands: CommandClass[];
    routings: CommandRoutingClass[];
}
