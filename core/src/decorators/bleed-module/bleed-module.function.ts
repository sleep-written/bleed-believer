import { BleedModuleOptions } from './bleed-module.options';
import { BleedModuleType } from './bleed-module.type';

export function BleedModule(options?: BleedModuleOptions): (obj: BleedModuleType) => void {
    return obj => {
        if (!obj.__meta__) {
            obj.__meta__ = {
                imports: options?.imports ?? [],
                exports: options?.exports ?? [],
                injects: [],
            };
        } else {
            obj.__meta__.imports = options?.imports ?? [];
            obj.__meta__.exports = options?.exports ?? [];
        }
    };
}
