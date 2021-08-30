import { ClassMeta } from '../../interfaces';

export interface BleedModuleOptions {
    imports?: ClassMeta<any, any>[];
    exports?: ClassMeta<any, any>[];
}
