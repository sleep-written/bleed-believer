import type { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';

export function stringifyFilter(d: CompositeFilterDescriptor | FilterDescriptor): string {
    const txt = JSON.stringify(d);
    return encodeURIComponent(txt);

    // if ((d as CompositeFilterDescriptor).filters instanceof Array) {
    //     const { filters, logic } = d as CompositeFilterDescriptor;
    //     const plainFilters = filters
    //         .map(x => stringifyFilter(x))
    //         .join(` ${logic} `);

    //     return `(${plainFilters})`;

    // } else {
    //     const { field, operator, value } = d as FilterDescriptor;
    //     const jsonValue = typeof value === 'string'
    //     ?   `'${value.replaceAll("'", "\\'")}'`
    //     :   JSON.stringify(value);

    //     switch (operator) {
    //         case 'startswith':
    //         case 'endswith':
    //         case 'contains': {
    //             return `${operator}(${field},${jsonValue})`;
    //         }

    //         case 'doesnotcontain': {
    //             return `not contains(${field},${jsonValue})`;
    //         }

    //         case 'isnull': {
    //             return `${field} eq null`;
    //         }

    //         case 'isnotnull': {
    //             return `${field} ne null`;
    //         }

    //         case 'isempty': {
    //             return `${field} eq ''`;
    //         }

    //         case 'isnotempty': {
    //             return `${field} ne ''`;
    //         }

    //         case 'gte':
    //         case 'lte': {
    //             return [ field, operator.replace('t', ''), jsonValue ].join(' ');
    //         }

    //         default: {
    //             return [ field, operator, jsonValue ].join(' ');
    //         }
    //     }
    // }
}