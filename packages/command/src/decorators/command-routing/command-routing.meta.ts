import {ClassMeta, CommandRoute, Executable} from '../../interfaces';
import {Metadata} from '../../tool/meta-manager';

export interface CommandRoutingMeta extends Metadata {
    main: string[];
    routes: ClassMeta<CommandRoute>[];
    commands: ClassMeta<Executable>[];
}
