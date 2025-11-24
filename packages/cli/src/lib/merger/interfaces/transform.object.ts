import type { MergerInstance } from './merger.instance.js';

export type TransformObject<T> = {
    [K in keyof T]: MergerInstance<T[K]>;
};