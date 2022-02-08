import { CommandRoute, Executable } from '../../interfaces';
import { ClassMeta, Meta } from '@bleed-believer/meta';

export interface CommandRoutingMeta extends Meta {
    main: string[];
    routes: ClassMeta<CommandRoute>[];
    commands: ClassMeta<Executable>[];
}
