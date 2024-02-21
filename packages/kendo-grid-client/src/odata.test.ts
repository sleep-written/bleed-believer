import type { GridViewRequest } from './interfaces/index.js';
import test, { type ExecutionContext } from 'ava';
import { OData } from './odata.js';

interface QsParts {
    $top?: number;
    $skip?: number;
    $filter?: string;
    $orderby?: string;
}

function buildTest(
    querystringParts: QsParts,
    dataSourceRequest: GridViewRequest,
    skip?: boolean
): void {
    const expect = Object
        .entries(querystringParts)
        .map(([ k, v ]) => `${k}=${encodeURIComponent(v?.toString())}`)
        .join('&');

    const message = `QS = "${expect}"`;
    const callback = (t: ExecutionContext) => {
        const result = new OData(dataSourceRequest).stringify();
        t.is(result, expect);
    };

    if (skip) {
        return test.skip(message, callback);
    } else {
        return test(message, callback);
    }
}

buildTest(
    { $top: 100, $skip: 50 },
    { pageSize: 100, skip: 50 }
);

buildTest(
    {
        $top: 100, $skip: 50,
        $orderby: 'date asc,cred desc'
    },
    {
        pageSize: 100, skip: 50, sort: [
            { field: 'date', dir: 'asc' },
            { field: 'cred', dir: 'desc' },
        ]
    }
    );
    
buildTest(
    {
        $top: 100, $skip: 50,
        $orderby: 'date asc,cred desc',
        $filter: 
                `{"filters":[{"field":"locked","operator":"lte","value":false},`
            +   `{"field":"signature","operator":"isnotnull"},{"field":"locale"`
            +   `,"operator":"startswith","value":"joder 'chaval'"},{"field":"d`
            +   `ate","operator":"gte","value":"2010-01-01T03:00:00.000Z"},{"fi`
            +   `lters":[{"field":"cod","operator":"eq","value":555},{"field":"`
            +   `cod","operator":"eq","value":666},{"field":"cod","operator":"e`
            +   `q","value":777}],"logic":"or"}],"logic":"and"}`
    },
    {
        pageSize: 100,
        skip: 50,
        sort: [
            { field: 'date', dir: 'asc' },
            { field: 'cred', dir: 'desc' },
        ],
        filter: {
            filters: [
                { field: 'locked',      operator: 'lte',        value: false },
                { field: 'signature',   operator: 'isnotnull' },
                { field: 'locale',      operator: 'startswith', value: "joder 'chaval'" },
                { field: 'date',        operator: 'gte',        value: new Date(2010, 0, 1) },
                {
                    filters: [
                        { field: 'cod', operator: 'eq', value: 555 },
                        { field: 'cod', operator: 'eq', value: 666 },
                        { field: 'cod', operator: 'eq', value: 777 },
                    ],
                    logic: 'or'
                }
            ],
            logic: 'and'
        }
    }
);
