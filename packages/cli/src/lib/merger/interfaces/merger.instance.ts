export interface MergerInstance<T> {
    merge(incoming: T, original: T): T;
}