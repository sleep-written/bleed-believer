import { ClassMeta } from '../../interfaces';
import { CommandMethodMeta } from './command-method.meta';

export type CommandMethodType = (
    target: ClassMeta<CommandMethodMeta> | any,
    paramKey: string,
    descriptor: PropertyDescriptor
) => void;
