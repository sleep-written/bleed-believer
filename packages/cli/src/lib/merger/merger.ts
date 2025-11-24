import type { TransformFunction, TransformObject } from './interfaces/index.js';

export class Merger<T> {
    #transform?: TransformFunction<T> | TransformObject<T>;

    constructor(transform?: TransformFunction<T> | TransformObject<T>) {
        this.#transform = transform;
    }

    merge(incoming: T, original: T): T {
        if (incoming === undefined) {
            return original;
        }
        
        if (typeof incoming === 'object' && incoming != null) {
            incoming = structuredClone(incoming);
        }
        
        if (typeof original === 'object' && original != null) {
            original = structuredClone(original);
        }

        if (typeof this.#transform === 'function') {
            const value = this.#transform(incoming, original);
            return value !== undefined
            ?   value
            :   original;
        }

        if (this.#transform) {
            Object
                .entries(this.#transform as Record<string, Merger<unknown>>)
                .forEach(([ k, m ]) => {
                    const v = m.merge(
                        incoming ? (incoming as any)[k] : undefined,
                        original ? (original as any)[k] : undefined
                    );

                    if (v !== undefined) {
                        (incoming as any)[k] = v;
                    }
                });
        }

        return incoming;
    }
}