import { MetadataNotFoundError } from './errors';
import { Metadata, TargetMeta } from './interfaces';

export class MetaManager {
    private _target: TargetMeta;

    constructor(target: any) {
        this._target = target;
    }

    get<M extends Metadata>(symbol: symbol): M {
        const meta = this._target?.__meta__?.[symbol];
        if (!meta) {
            throw new MetadataNotFoundError(symbol);
        } else {
            return meta as M;
        }
    }

    set<M extends Metadata>(symbol: symbol, meta: M): void {
        if (!this._target?.__meta__) {
            this._target.__meta__ = {};
        }

        this._target.__meta__[symbol] = meta;
    }

    some(symbol: symbol): boolean {
        const symbols = this._target?.__meta__
            ? Object.getOwnPropertySymbols(this._target.__meta__)
            : [];

        return symbols.some(x => x === symbol);
    }

    del(symbol: symbol): void {
        if (this._target?.__meta__) {
            delete this._target.__meta__[symbol];
        }
    }
}
