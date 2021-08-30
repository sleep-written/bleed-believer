import { BleedModuleType } from '../decorators';

export interface BleedResult<T extends BleedModuleType> {
    imports: InstanceType<T>[];
    exports: InstanceType<T>[];
    current: InstanceType<T>;
}
