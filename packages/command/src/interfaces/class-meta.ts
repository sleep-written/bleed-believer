import { TargetMeta } from '../tool/meta-manager';

export interface ClassMeta<T> extends TargetMeta {
    new(...args: any[]): T;
}
