import test from 'ava';
import * as qs from 'qs';

import { odataQsParser } from './odata-qs-parser.js';

// Test 1.1: Verifying correct OData query string for pagination object
test('Pagination Object Query String', t => {
    const options = odataQsParser({
        query: qs.parse('take=20&skip=10')
    });

    t.deepEqual(options, { pagination: { skip: 10, take: 20 } });
});

// Test 1.2: Handling simple and composite filters
test('Simple and Composite Filters', t => {
    const queryStr = odataQsParser({
        query: qs.parse(
                'filter=%7B%22logic%22%3A%22and%22%2C%22filters%22%3A%5B%'
            +   '7B%22field%22%3A%22name%22%2C%22operator%22%3A%22eq%22%2'
            +   'C%22value%22%3A%22John%22%7D%2C%7B%22field%22%3A%22age%2'
            +   '2%2C%22operator%22%3A%22gte%22%2C%22value%22%3A30%7D%5D%7D'
        )
    });

    t.deepEqual(queryStr, {
        filter: {
            logic: 'and',
            filters: [
                { field: 'name', operator: 'eq', value: 'John' },
                { field: 'age', operator: 'gte', value: 30 }
            ]
        }
    });
});

// Test 1.3: Adding sort information correctly
test('Sort Information', t => {
    const options = odataQsParser({ query: qs.parse('sort=name(asc)') });
    t.deepEqual(options, { sort: [{ field: 'name', dir: 'asc' }] });
});

// Test 1.4: Verifying correct OData query string for pagination object with both skip and take as 0
test('Pagination Object Query String with zero values', t => {
    const options = odataQsParser({ query: qs.parse('') });
    t.deepEqual(options, {});
});

// Test 1.5: Handling empty filters
test('Empty Filters', t => {
    const options = odataQsParser({
        query: qs.parse(`filter=%7B%22logic%22%3A%22and%22%2C%22filters%22%3A%5B%5D%7D`)
    });

    t.deepEqual(options, { filter: { logic: 'and', filters: [] } });
});

// Test 1.6: Handling null and undefined values in filters
test('Null and Undefined Values in Filters', t => {
    const options = odataQsParser({
        query: qs.parse(
                'filter=%7B%22logic%22%3A%22and%22%2C%22filters%22%3A%5B%7B%22field%22%3A%22na'
            +   'me%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3Anull%7D%2C%7B%22field%22%3A'
            +   '%22age%22%2C%22operator%22%3A%22eq%22%7D%5D%7D'
        )
    });

    t.deepEqual(options, {
        filter: {
            logic: 'and',
            filters: [
                { field: 'name', operator: 'eq', value: null },
                { field: 'age', operator: 'eq' }
            ]
        }
    });
});

// Test 1.7: Adding multiple sort information correctly
test('Multiple Sort Information', t => {
    const options = odataQsParser({ query: qs.parse('sort=name(asc);age(desc)') });
    t.deepEqual(options, { sort: [{ field: 'name', dir: 'asc' }, { field: 'age', dir: 'desc' }] });
});
