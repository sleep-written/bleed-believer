import {ClassMeta, CommandRoute, Executable} from '../../interfaces';

export interface CommandRoutingOptions {
    main?: string;
    routes?: ClassMeta<CommandRoute>[];
    commands?: ClassMeta<Executable>[];
}
