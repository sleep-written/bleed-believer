import { BleedResult } from './interfaces';
import { BleedModuleType } from './decorators';
import { BleedModuleMeta } from './decorators/bleed-module/bleed-module.meta';
import { InvalidModuleError, ModuleNotInitializedError } from './errors';

/**
 * Instance of a BleedModule.
 */
type Instance = InstanceType<BleedModuleType>;

/**
 * A class wrap all 
 */
export class BleedBeliever<T extends BleedModuleType> {
    private _rootModule: T;

    constructor(module: T) {
        this._rootModule = module;
    }

    private _compareWithModule(module: BleedModuleType): (x: any) => boolean {
        return x => {
            const proto = Object.getPrototypeOf(x);
            return proto.constructor === module;
        }
    }

    private _compareWithInst(instance: Instance): (x: any) => boolean {
        const proto = Object.getPrototypeOf(instance);
        return x => {
            return proto.constructor === x;
        }
    }

    bleed(): BleedResult<T> {
        const result: BleedResult<T> = {
            imports: [],
            exports: [],
            current: null,
        };

        // Validate "__meta__"
        const meta: BleedModuleMeta = this._rootModule.__meta__;
        if (
            (!(meta?.imports instanceof Array)) ||
            (!(meta?.exports instanceof Array))
        ) {
            throw new InvalidModuleError(this._rootModule);
        }

        // Iterate through imported modules
        const exported: Instance[] = [];
        for (const ref of meta.imports) {
            const otherBleed = new BleedBeliever(ref);
            const other = otherBleed.bleed();

            result.imports.push(other.current);
            exported.push(...other.exports);
        }

        // Prepare objects to export
        for (const ref of meta.exports) {
            let inst = result.imports.find(this._compareWithModule(ref));

            if (!inst) {
                const found = exported.some(this._compareWithModule(ref));
                if (!found) {
                    throw new ModuleNotInitializedError(ref);
                }
            } else {
                exported.push(inst);
            }
        }

        // Clear Exported array
        for (const item of exported) {
            const other = meta.exports.some(this._compareWithInst(item));
            if (other) {
                result.exports.push(item);
            }
        }

        // Prepare module injection
        const params: Instance[] = new Array(this._rootModule.length);
        for (const inject of meta.injects) {
            const instance = exported.find(x => {
                const proto = Object.getPrototypeOf(x);
                return proto.constructor === inject.module;
            });

            if (instance) {
                params[inject.index] = instance;
            }
        }

        // Add the main module
        result.current = new this._rootModule(...params);
        return result;
    }
}
