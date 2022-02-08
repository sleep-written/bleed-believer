import { ObjectMeta } from './object-meta';

export interface ClassMeta<T> extends ObjectMeta {
    new(...args: any[]): T;
}
