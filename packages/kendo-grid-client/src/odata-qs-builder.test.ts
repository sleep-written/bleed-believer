
import test from 'ava';
import { odataQsBuilder } from './odata-qs-builder.js';
import type { ODataQsOptions } from './interfaces/index.js';

// Test 1.1: Verifying correct OData query string for pagination object
test('Pagination Object Query String', t => {
    const options: ODataQsOptions = { pagination: { skip: 10, take: 20 } };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr, 'take=20&skip=10');
});

// Test 1.2: Handling simple and composite filters
test('Simple and Composite Filters', t => {
    const options: ODataQsOptions = {
        filter: {
            logic: 'and',
            filters: [
                { field: 'name', operator: 'eq', value: 'John' },
                { field: 'age', operator: 'gte', value: 30 }
            ]
        }
    };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr, `filter=${encodeURIComponent(JSON.stringify(options.filter))}`);
});

// Test 1.3: Adding sort information correctly
test('Sort Information', t => {
    const options: ODataQsOptions = { sort: [{ field: 'name', dir: 'asc' }] };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr, 'sort=name(asc)');
});

// Test 1.4: Verifying correct OData query string for pagination object with both skip and take as 0
test('Pagination Object Query String with zero values', t => {
    const options: ODataQsOptions = { pagination: { skip: 0, take: 0 } };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr, '');
});

// Test 1.5: Handling empty filters
test('Empty Filters', t => {
    const options: ODataQsOptions = { filter: { logic: 'and', filters: [] } };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr, `filter=${encodeURIComponent(JSON.stringify(options.filter))}`);
});

// Test 1.6: Handling null and undefined values in filters
test('Null and Undefined Values in Filters', t => {
    const options: ODataQsOptions = {
        filter: {
            logic: 'and',
            filters: [
                { field: 'name', operator: 'eq', value: null },
                { field: 'age', operator: 'eq', value: undefined }
            ]
        }
    };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr,
            `filter=%7B%22logic%22%3A%22and%22%2C%22filters%22%3A%5B%7B%22field%22%3A%22name%22`
        +   '%2C%22operator%22%3A%22eq%22%2C%22value%22%3Anull%7D%2C%7B%22field%22%3A%22age%22%'
        +   '2C%22operator%22%3A%22eq%22%7D%5D%7D'
    );
});

// Test 1.7: Adding multiple sort information correctly
test('Multiple Sort Information', t => {
    const options: ODataQsOptions = { sort: [{ field: 'name', dir: 'asc' }, { field: 'age', dir: 'desc' }] };
    const queryStr = odataQsBuilder(options);
    t.is(queryStr, 'sort=name(asc);age(desc)');
});
