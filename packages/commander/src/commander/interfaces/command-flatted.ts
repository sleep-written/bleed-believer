import { CommandRoute, Executable, GetClass } from '../../interfaces';

export interface CommandFlatted {
    main: string[];
    routes: GetClass<CommandRoute>[];
    command: GetClass<Executable>;
}
