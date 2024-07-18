import type { CompositeFilterDescriptor, FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import type { ParsedQs } from './interfaces/index.js';


export class QuerystringParser {
    #qs: string;
    #filterColumnParsers = new Map<any, (v: any) => any>();

    get querystring(): string {
        return this.#qs;
    }

    constructor(
        url: string,
        filterColumnParsers?: Record<string, (v: any) => any>
    ) {
        this.#qs = url.includes('?')
            ?   url.replace(/^[^?]+\?+/gi, '')
            :   '';

        Object
            .entries(filterColumnParsers ?? {})
            .forEach(([ key, value ]) => {
                this.#filterColumnParsers.set(key, value);
            });
    }

    #validateSort(o: SortDescriptor): void {
        if (o == null) {
            throw new Error('`SortDescriptor` cannot be null or undefined.');
        }

        if (
            typeof o.field !== 'string' ||
            o.field.trim().length === 0
        ) {
            throw new Error('`SortDescriptor.field` must be a non empty string.')
        }

        switch (o.dir) {
            case 'asc':
            case 'desc': {
                break;
            }

            default: {
                if (o.dir == null) {
                    delete o.dir;
                } else {
                    throw new Error('`SortDescriptor.dir` must be "asc" or "desc".');
                }
            }
        }
    }

    #parseSort(raw: string): SortDescriptor[] {
        const json: SortDescriptor | SortDescriptor[] = decodeURIComponent(raw)
            .split(/\s*,\s*/gi)
            .map(r => {
                    const [ field, dir ] = r.split(/\s+/gi);
                    return { field, dir } as any;
            });

        const sorts = !(json instanceof Array)
            ?   [ json ]
            :   json;
        
        for (const sort of sorts) {
            this.#validateSort(sort);
        }

        return sorts;
    }

    #validateFilter(o: CompositeFilterDescriptor | FilterDescriptor): void {
        if (
            (o as CompositeFilterDescriptor).filters instanceof Array
        ) {
            if (
                (o as CompositeFilterDescriptor).logic !== 'and' &&
                (o as CompositeFilterDescriptor).logic !== 'or'
            ) {
                throw new Error('`CompositeFilterDescriptor.logic` must be "and" or "or".');
            } else {
                for (const filter of (o as CompositeFilterDescriptor).filters) {
                    this.#validateFilter(filter);
                }
            }
        } else if (
            typeof (o as FilterDescriptor).field !== 'string' ||
            typeof (o as FilterDescriptor).operator !== 'string'
        ) {
            throw new Error(
                    'The input object must implements `Composite FilterDescriptor` '
                +   'or `FilterDescriptor` interface.'
            );
        }
    }

    #parseFilterColumnValues(o: CompositeFilterDescriptor | FilterDescriptor): void {
        if ((o as CompositeFilterDescriptor).filters instanceof Array) {
            // Iterar recursivamente dentro de los filtros anidados
            for (const filter of (o as CompositeFilterDescriptor).filters) {
                this.#parseFilterColumnValues(filter);
            }
        } else if (
            typeof (o as FilterDescriptor).field === 'string' &&
            typeof (o as FilterDescriptor).operator === 'string'
        ) {
            // Buscar el parseador para el filtro
            const parser = this.#filterColumnParsers.get((o as FilterDescriptor).field);
            if (parser) {
                (o as FilterDescriptor).value = parser((o as FilterDescriptor).value);
            }
        }
    }

    #parseFilter(raw: string): CompositeFilterDescriptor {
        const text = decodeURIComponent(raw);
        const filters: CompositeFilterDescriptor = JSON.parse(text);

        // Agregar validaciones aquí
        this.#validateFilter(filters);
        this.#parseFilterColumnValues(filters);

        return filters;
    }

    parse(): ParsedQs {
        const out: ParsedQs = {};
        const raw: Record<string, string> = Object.fromEntries(
            this.#qs
                .split('&')
                .map(i => {
                    const o = i.split('=') as [ string, any? ];
                    if (o.length === 1) {
                        o.push(undefined);
                    }

                    return o;
                })
        );

        const take = parseInt(raw.$top);
        if (!isNaN(take)) {
            out.take = take;
        }

        const skip = parseInt(raw.$skip);
        if (!isNaN(skip)) {
            out.skip = skip;
        }

        if (raw.$orderby) {
            out.sort = this.#parseSort(raw.$orderby);
        }

        if (raw.$filter) {
            out.filter = this.#parseFilter(raw.$filter);
        }

        return out;
    }
}