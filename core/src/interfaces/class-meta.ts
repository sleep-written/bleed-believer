export interface ClassMeta<T, U = any> {
    __meta__?: T;
    new(): U;
}