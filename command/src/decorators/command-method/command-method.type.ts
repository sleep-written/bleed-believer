import { ClassMeta } from '@bleed-believer/core';
import { CommandMethodMeta } from './command-method.meta';

export type CommandMethodType = (
    target: ClassMeta<CommandMethodMeta> | any,
    paramKey: string,
    descriptor: PropertyDescriptor
) => void;
