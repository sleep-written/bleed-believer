import { ValueNotFoundError } from './errors';

export class Metadata {
    #data: Record<symbol, any>;

    constructor() {
        this.#data = {};
    }

    some(symbol: symbol): boolean {
        return Object
            .getOwnPropertySymbols(this.#data)
            .some(s => s === symbol);
    }

    set(symbol: symbol, data: any): void {
        this.#data[symbol] = data;
    }

    get(symbol: symbol): any {
        const found = this.some(symbol);
        if (!found) {
            throw new ValueNotFoundError();
        }

        return this.#data[symbol];
    }
}