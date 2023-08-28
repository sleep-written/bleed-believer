import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface KendoTransformer<T extends ObjectLiteral> {
    /**
     * Transforma una `QueryBuilder` de entrada, según parámetros de la instancia de `KendoTranformer`.
     * @param query La instancia de QueryBuilder que desea manipular usando el transformador.
     */
    transform(query: SelectQueryBuilder<T>): SelectQueryBuilder<T>;
}