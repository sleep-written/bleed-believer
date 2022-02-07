import {ClassMeta, Executable} from '../../interfaces';
import {Metadata} from '../../tool/meta-manager';

export interface CommandRoutingMeta extends Metadata {
    main: string[];
    commands: ClassMeta<Executable>[];
}
