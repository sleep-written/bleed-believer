import type { CommandClass } from '../../command/interfaces/index.js';
import type { CommandRoutingClass } from './command-routing.class.js';

export type CommandRoutingOptions = 
    {
        path?: string;
        commands: CommandClass[];
        routings: CommandRoutingClass[];
    } | {
        path?: string;
        commands: CommandClass[];
    } | 
    {
        path?: string;
        routings: CommandRoutingClass[];
    };
