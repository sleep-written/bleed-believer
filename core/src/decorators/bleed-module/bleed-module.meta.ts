import { ClassMeta } from '../../interfaces';
import { InjectMeta } from '../inject/inject.meta';

export interface BleedModuleMeta {
    imports: any[];
    exports: any[];
    injects: InjectMeta[];
}
