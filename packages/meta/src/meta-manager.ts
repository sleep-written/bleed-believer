import type { Metadata } from './metadata.js';
import { MetaStorage } from './meta-storage.js';
import { UndefinedMetaError } from './errors/undefined-meta-error.js';

export class MetaManager<T extends Metadata> {
    /**
     * Destroy all trace of metadata from an object. All
     * data stored in the target using this library will be lost.
     * @param target The object do you want to purge.
     */
    static purge(target: any): void {
        MetaStorage.purge(target);
    }

    private _symbol: symbol;

    constructor(description?: string) {
        this._symbol = Symbol(description);
    }

    /** Gets the metadata linked to this `Meta` instance.
     * @param target The object do you want to get the metadata.
     * @param permisive __`[optional]`__ If this parameter is true and
     * the requested metadata isn't found, the response will be `undefined`,
     * otherwise, an `UndefinedMetaError` will be throwed.
     */
    get(target: any, permisive?: false): T;
    get(target: any, permisive: true): T | undefined;
    get(target: any, permisive?: boolean): T | undefined {
        const storage = MetaStorage.getStorage(target);
        if (!permisive && !storage) {
            throw new UndefinedMetaError();
        } else if (!storage) {
            return undefined;
        }

        return storage.get<T>(this._symbol);
    }

    /**
     * Sets the metadata into the target with the specified value.
     * @param target The object do you want to set the metadata.
     * @param value The value to insert.
     */
    set(target: any, value: T): void {
        const storage = MetaStorage.buildStorage(target);
        return storage.set(this._symbol, value);
    }

    /**
     * Removes the current metadata of the desired object.
     * @param target The object do you want to remove this metadata.
     */
    clean(target: any): void {
        const storage = MetaStorage.getStorage(target);
        storage?.rem(this._symbol);
    }
}
