import { ClassMeta, CommandRoute, Executable } from '../../interfaces';

export interface CommandRoutingOptions {
    path: string;
    attach: ClassMeta<Executable | CommandRoute>[];
};
