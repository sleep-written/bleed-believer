import { CommandClass, CommandRoutingClass } from '../interfaces';

export interface CommandRoutingMeta {
    main: string[];
    routes: CommandRoutingClass[];
    commands: CommandClass[];
}
