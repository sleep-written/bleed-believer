import { ClassMeta } from '../../interfaces';
import { BleedModuleMeta } from '../bleed-module/bleed-module.meta';

export class InjectMeta {
    key: string | symbol;
    index: number;
    module: ClassMeta<BleedModuleMeta>;
}