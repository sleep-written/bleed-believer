import { ClassMeta } from './class-meta';

export type ClassMetaDecorator<T> = (
    o: ClassMeta<T>
) => void;