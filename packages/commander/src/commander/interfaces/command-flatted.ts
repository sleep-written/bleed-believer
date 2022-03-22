import { CommandClass, CommandRoutingClass } from '../../interfaces';

export interface CommandFlatted {
    main: string[];
    routes: CommandRoutingClass[];
    command: CommandClass;
}
