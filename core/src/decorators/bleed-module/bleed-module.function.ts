import { BleedModuleOptions } from './bleed-module.options';
import { BleedModuleType } from './bleed-module.type';

export function BleedModule(options?: BleedModuleOptions): (obj: BleedModuleType) => void {
    return obj => {
        obj.__meta__ = {
            imports: options?.imports ?? [],
            exports: options?.exports ?? [],
        };
    };
}
