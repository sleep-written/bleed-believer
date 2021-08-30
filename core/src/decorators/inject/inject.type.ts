import { ClassMeta } from '../../interfaces';
import { BleedModuleMeta } from '../bleed-module/bleed-module.meta';

export type InjectType = (target: ClassMeta<BleedModuleMeta>, key: string | symbol, i: number) => void;
