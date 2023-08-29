import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { KendoTransformer } from './interfaces/kendo-transformer.js';
import type { SortDescriptor } from '@progress/kendo-data-query';
import type { JoinAttribute } from 'typeorm/query-builder/JoinAttribute.js';

export class KendoSort<T extends ObjectLiteral = any> implements KendoTransformer<T> {
    #sorts: SortDescriptor[];

    #appendMain: boolean;
    get appendMain(): boolean {
        return this.#appendMain;
    }

    constructor(sort: SortDescriptor | SortDescriptor[], appendMain?: boolean) {
        this.#appendMain = !!appendMain;
        this.#sorts = sort instanceof Array
            ?   sort
            :   [ sort ];

        // Filtrar los que no tengan dirección
        this.#sorts = this.#sorts.filter(x => x.dir != null);
    }

    transform(query: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        if (this.#sorts.length === 0) {
            return query.orderBy('1', 'ASC');
        } else {
            let qb = query;
            for (let { field, dir }  of this.#sorts) {
                // Selects the correct order by
                const { expressionMap: { mainAlias, orderBys } } = qb;
                const orderBy = Object.keys(orderBys).length > 0
                    ?   qb.addOrderBy.bind(qb)
                    :   qb.orderBy.bind(qb);
    
                // Add the main prefix
                if (this.#appendMain) {
                    if (field.includes('.')) {
                        // Campo con prefijo, probablemente de un join
                        const parts = field.split('.');
                        const path = parts
                            .slice(0, -1)
                            .join('.');

                        const join = qb
                            .expressionMap
                            .joinAttributes
                            .find(x => x
                                .relation
                                ?.propertyPath === path
                            );

                        if (join) {
                            field = `${join.alias.name}.${parts.at(-1)}`;
                        }

                    } else if (typeof mainAlias?.name === 'string') {
                        // Campo sin prefijo, debe ser de la tabla base
                        field = `${mainAlias.name}.${field}`;
                    }
                }

                if (
                    this.#appendMain &&
                    !field.match(/\./gi) &&
                    typeof mainAlias?.name === 'string'
                ) {
                    field = `${mainAlias.name}.${field}`;
                } else if (this.#appendMain && field.includes('.')) {
                    const left = field.split('.')[0].toLowerCase();
                    const found = qb.expressionMap
                        .aliases
                        .find(x => x.name.toLowerCase() === left);

                    if (found) {
                        const right = field.replace(/^[^\.]+\./gi, '');
                        field = `${found.name}.${right}`;
                    }
                }
    
                switch (dir) {
                    case undefined:
                    case null: {
                        break;
                    }
                    case 'asc': {
                        qb = orderBy(field, 'ASC');
                        break;
                    }
                    case 'desc': {
                        qb = orderBy(field, 'DESC');
                        break;
                    }
                    default: {
                        throw new Error(`The direction "${dir}" is invalid`);
                    }
                }
            }
    
            return qb;
        }
    }
}