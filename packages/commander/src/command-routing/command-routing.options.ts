import { CommandRoute, Executable, GetClass } from '../interfaces';

export interface CommandRoutingOptions {
    main?: string;
    routes?: GetClass<CommandRoute>[];
    commands?: GetClass<Executable>[];
}
