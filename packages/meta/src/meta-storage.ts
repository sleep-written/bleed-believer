import type { Metadata } from './metadata.js';
import { UndefinedMetaError, UndefinedTargetError } from './errors/index.js';

export class MetaStorage {
    private static _symbol = Symbol('@bleed-believer/meta:meta-storage');

    static buildStorage(target: any): MetaStorage {
        if (target == null) {
            throw new UndefinedTargetError();
        }

        if (!target[MetaStorage._symbol]) {
            target[MetaStorage._symbol] = new MetaStorage();
        }

        return target[MetaStorage._symbol];
    }

    static getStorage(target: any): MetaStorage | undefined {
        if (target == null) {
            throw new UndefinedTargetError();
        }

        const storage = target[MetaStorage._symbol];
        return storage ?? undefined;
    }

    static purge(target: any): void {
        if (target == null) {
            throw new UndefinedTargetError();
        }

        delete target[MetaStorage._symbol];
    }

    private _data: Record<symbol, Metadata>;

    private constructor() {
        this._data = {};
    }

    get<T extends Metadata>(symbol: symbol, permisive?: false): T;
    get<T extends Metadata>(symbol: symbol, permisive?: true): T | undefined;
    get<T extends Metadata>(symbol: symbol, permisive?: boolean): T | undefined {
        const found = Object
            .getOwnPropertySymbols(this._data)
            .some(k => k === symbol);

        if (!found && !permisive) {
            throw new UndefinedMetaError();
        } else {
            return this._data[symbol] as T;
        }
    }

    set(symbol: symbol, value: Metadata): void {
        this._data[symbol] = value;
    }

    rem(symbol: symbol): void {
        delete this._data[symbol];
    }
}
