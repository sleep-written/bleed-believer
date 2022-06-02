import test from 'ava';

import { flattenRoute } from './flatten-route.js';

import * as Case01 from './case-01.example.js';
import * as Case02 from './case-02.example.js';
import * as Case03 from './case-03.example.js';
import * as Case04 from './case-04.example.js';

test('Eval Case 01', t => {
    const result = flattenRoute(Case01.Routing01);

    // Check paths
    t.deepEqual(
        result.map(x => x.path),
        [
            ['com01'],
            ['com02'],
        ]
    );

    // Check Commands
    t.is(result[0].command, Case01.Com01);
    t.is(result[1].command, Case01.Com02);
});

test('Eval Case 02', t => {
    const result = flattenRoute(Case02.Routing01);

    // Check paths
    t.deepEqual(
        result.map(x => x.path),
        [
            ['joder', 'chaval', 'com01'],
            ['joder', 'chaval', 'com02'],
        ]
    );

    // Check Commands
    t.is(result[0].command, Case02.Com01);
    t.is(result[1].command, Case02.Com02);
});

test('Eval Case 03', t => {
    const result = flattenRoute(Case03.Routing02);
    
    // Check paths
    t.deepEqual(
        result.map(x => x.path),
        [
            ['joder', 'chaval', 'com01'],
            ['joder', 'chaval', 'com02'],
            ['com03'],
            ['com04'],
        ]
    );

    // Check Commands
    t.is(result[0].command, Case03.Com01);
    t.is(result[1].command, Case03.Com02);
    t.is(result[2].command, Case03.Com03);
    t.is(result[3].command, Case03.Com04);

    // Check Routes
    t.deepEqual(result[0].routings, [Case03.Routing02, Case03.Routing01]);
    t.deepEqual(result[1].routings, [Case03.Routing02, Case03.Routing01]);
    t.deepEqual(result[2].routings, [Case03.Routing02]);
    t.deepEqual(result[3].routings, [Case03.Routing02]);
});

test('Eval Case 04', t => {
    const result = flattenRoute(Case04.Routing02);

    // Check paths
    t.deepEqual(
        result.map(x => x.path),
        [
            ['api', 'rest', 'joder', 'chaval', 'com01'],
            ['api', 'rest', 'joder', 'chaval', 'com02'],
            ['api', 'rest', 'com03'],
            ['api', 'rest', 'com04'],
        ]
    );

    // Check Commands
    t.is(result[0].command, Case04.Com01);
    t.is(result[1].command, Case04.Com02);
    t.is(result[2].command, Case04.Com03);
    t.is(result[3].command, Case04.Com04);

    // Check Routes
    t.deepEqual(result[0].routings, [Case04.Routing02, Case04.Routing01]);
    t.deepEqual(result[1].routings, [Case04.Routing02, Case04.Routing01]);
    t.deepEqual(result[2].routings, [Case04.Routing02]);
    t.deepEqual(result[3].routings, [Case04.Routing02]);
});
