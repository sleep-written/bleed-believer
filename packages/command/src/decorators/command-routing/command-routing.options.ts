import {ClassMeta, Executable} from '../../interfaces';

export type CommandRoutingOptions = 
    {
        main?: string;
        commands: ClassMeta<Executable>[];
    } | 
    ClassMeta<Executable>[];
