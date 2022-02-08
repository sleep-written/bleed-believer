import { ClassMeta } from '@bleed-believer/meta';

export type ClassMetaDecorator<T> = (
    o: ClassMeta<T>
) => void;