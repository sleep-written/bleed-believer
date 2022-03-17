import { CommandRoute, Executable, GetClass } from '../interfaces';

export interface CommandRoutingMeta {
    main: string[];
    routes: GetClass<CommandRoute>[];
    commands: GetClass<Executable>[];
}
