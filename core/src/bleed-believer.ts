import { BleedModuleType } from './decorators';
import { BleedModuleMeta } from './decorators/bleed-module/bleed-module.meta';
import { InvalidModuleError } from './errors';

/**
 * A class wrap all 
 */
export class BleedBeliever {
    private _rootModule: BleedModuleType;

    constructor(module: BleedModuleType) {
        this._rootModule = module;
    }

    bleed(): object[] {
        // Validate "__meta__"
        const meta: BleedModuleMeta = this._rootModule.__meta__;
        if (
            (!(meta?.imports instanceof Array)) ||
            (!(meta?.exports instanceof Array))
        ) {
            throw new InvalidModuleError(this._rootModule);
        }

        // Iterate through modules
        let imports: object[] = [];
        for (const ref of meta.imports) {
            const otherBleed = new BleedBeliever(ref);
            const other = otherBleed.bleed();
            imports = imports.concat(other);
        }

        // Add the main module
        const main = new this._rootModule();
        imports.push(main);
        return imports;
    }
}
