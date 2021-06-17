import { ClassMeta } from '../../interfaces';
import { BleedModuleMeta } from './bleed-module.meta';

export interface BleedModuleOptions {
    imports?: ClassMeta<BleedModuleMeta>[];
    exports?: ClassMeta<BleedModuleMeta>[];
}
