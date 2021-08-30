import { InjectType } from './inject.type';
import { BleedModule, BleedModuleType } from '../bleed-module';

export function Inject(module: BleedModuleType): InjectType {
    return (obj, key, index) => {
        // Build default meta
        if (!obj.__meta__) {
            BleedModule()(obj);
        }

        // Add the injection
        obj.__meta__.injects.push({ key, index, module });
    }
}
