import { BleedModuleType } from '../decorators';

export class ModuleNotInitializedError extends Error {
    constructor();
    constructor(module: BleedModuleType);
    constructor(module?: BleedModuleType) {
        super();

        if (module?.name) {
            this.message =  `The module "${module.name}" has not been initialized `
                        +   `before being exported.`;
        } else {
            this.message =  `The current module has not been initialized `
                        +   `before being exported.`;
        }
    }
}
