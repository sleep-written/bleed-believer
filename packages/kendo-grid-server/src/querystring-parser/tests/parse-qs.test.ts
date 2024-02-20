import type { ParsedQs } from '../interfaces/index.js';

import test, { type ExecutionContext } from 'ava';
import { QuerystringParser } from '../querystring-parser.js';

function buildTest(
    qs: string,
    expected: ParsedQs,
    options?: {
        skip?: boolean;
        columns?: Record<string, (v: any) => any>;
    }
): void {
    const title = `QS = "${qs}"`;
    function callback(t: ExecutionContext): void {
        const result = new QuerystringParser(
            `path/to/dir?${qs}`,
            options?.columns
        ).parse();
        t.deepEqual(result, expected);
    }

    if (options?.skip) {
        return test.skip(title, callback);
    } else {
        return test(title, callback);
    }
}

buildTest(
    `$top=100&$skip=50`,
    { take: 100, skip: 50 }
);

buildTest(
    `$top=100&$skip=50&$orderby=date%20asc%2Ccred%20desc`,
    {
        take: 100, skip: 50,
        sort: [
            { field: 'date', dir: 'asc' },
            { field: 'cred', dir: 'desc' },
        ]
    }
);

buildTest(
    `$top=100&$skip=50&$orderby=date%20asc%2Ccred%20desc&`
+   `$filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22lo`
+   `cked%22%2C%22operator%22%3A%22lte%22%2C%22value%22%3`
+   `Afalse%7D%2C%7B%22field%22%3A%22signature%22%2C%22op`
+   `erator%22%3A%22isnotnull%22%7D%2C%7B%22field%22%3A%2`
+   `2locale%22%2C%22operator%22%3A%22startswith%22%2C%22`
+   `value%22%3A%22joder%20'chaval'%22%7D%2C%7B%22field%2`
+   `2%3A%22date%22%2C%22operator%22%3A%22gte%22%2C%22val`
+   `ue%22%3A%222010-01-01T03%3A00%3A00.000Z%22%7D%2C%7B%`
+   `22filters%22%3A%5B%7B%22field%22%3A%22cod%22%2C%22op`
+   `erator%22%3A%22eq%22%2C%22value%22%3A555%7D%2C%7B%22`
+   `field%22%3A%22cod%22%2C%22operator%22%3A%22eq%22%2C%`
+   `22value%22%3A666%7D%2C%7B%22field%22%3A%22cod%22%2C%`
+   `22operator%22%3A%22eq%22%2C%22value%22%3A777%7D%5D%2`
+   `C%22logic%22%3A%22or%22%7D%5D%2C%22logic%22%3A%22and`
+   `%22%7D`
,
    {
        take: 100, skip: 50,
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
    },
    {
        columns: {
            date: v => v != null
                ?   new Date(v)
                :   v
        }
    }
);