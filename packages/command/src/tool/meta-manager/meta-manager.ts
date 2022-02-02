import { Metadata, TargetMeta } from './interfaces';

export class MetaManager {
    private _target: TargetMeta;

    constructor(target: any) {
        this._target = target;
    }

    get<M extends Metadata>(symbol: symbol): M | null {
        if (!this._target?.__meta__) { return null; }

        const meta = this._target?.__meta__;
        return meta[symbol] as M ?? null;
    }

    set<M extends Metadata>(symbol: symbol, meta: M): void {
        if (!this._target?.__meta__) {
            this._target.__meta__ = {};
        }

        this._target.__meta__[symbol] = meta;
    }

    del(symbol: symbol): void {
        if (this._target?.__meta__) {
            delete this._target.__meta__[symbol];
        }
    }
}
