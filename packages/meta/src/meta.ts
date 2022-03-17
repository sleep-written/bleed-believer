import { MetadataNotFoundError, UndefinedTargetError } from './errors';
import { Metadata } from './metadata';

export class Meta<T extends Record<string, any>> {
    static SYMBOL = Symbol();
    #symbol: symbol;

    constructor(description?: string) {
        this.#symbol = Symbol(description);
    }

    get(target: any): T {
        if (target == null) {
            throw new UndefinedTargetError();
        }

        const meta: Metadata = target[Meta.SYMBOL];
        if (!(meta instanceof Metadata)) {
            throw new MetadataNotFoundError();
        }

        return meta.get(this.#symbol);
    }

    set(target: any, data: T): void {
        if (target == null) {
            throw new UndefinedTargetError();
        }

        let meta: Metadata = target[Meta.SYMBOL];
        if (!(meta instanceof Metadata)) {
            meta = new Metadata();
            target[Meta.SYMBOL] = meta;
        }

        meta.set(this.#symbol, data);
    }

    some(target: any): boolean {
        if (target == null) {
            return false;
        }

        const meta: Metadata = target[Meta.SYMBOL];
        if (!(meta instanceof Metadata)) {
            return false;
        }

        return meta.some(this.#symbol);
    }
}
