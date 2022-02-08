import { Meta, ObjectMeta } from './interfaces';

export class MetaManager<T extends Meta> {
    private _key: symbol;
    constructor(name?: string) {
        this._key = Symbol(name);
    }

    get(target: any): T {
        if (target == null) {
            throw new Error();
        }

        if (!(target as ObjectMeta).__meta__) {
            throw new Error();
        } else {
            const main = target.__meta__;
            const meta = main[this._key];
            if (!meta) {
                throw new Error();
            } else {
                return meta as T;
            }
        }
    }

    set(target: any, data: T): void {
        if (target == null) {
            throw new Error();
        }

        if (!(target as ObjectMeta).__meta__) {
            target.__meta__ = {};
        }
        
        const main = target.__meta__;
        main[this._key] = data;
    }

    some(target: any): boolean {
        if (target == null) {
            return false;
        }

        if (!(target as ObjectMeta).__meta__) {
            return false;
        }

        const main = target.__meta__;
        const keys = Object.getOwnPropertySymbols(main);
        return keys.some(x => x === this._key);
    }
}
