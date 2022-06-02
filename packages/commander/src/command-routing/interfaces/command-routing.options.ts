import { CommandClass } from '../../command/interfaces/index.js';
import { CommandRoutingClass } from './command-routing.class.js';

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
