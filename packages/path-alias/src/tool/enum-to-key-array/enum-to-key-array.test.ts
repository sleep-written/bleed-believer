import { enumToKeyArray } from './enum-to-key-array.js';
import test from 'ava';

test('Get enum keys of "ScriptTarget"', t => {
    enum ScriptTarget {
        'ES3',    'ES5',
        'ES2015', 'ES2016',
        'ES2017', 'ES2018',
        'ES2019', 'ES2020',
        'ES2021', 'ES2022',
        'ES2023', 'ESNext',
        'JSON',   'Latest'
    }

    const keys = enumToKeyArray(ScriptTarget);
    t.deepEqual(keys, [
        'ES3',    'ES5',
        'ES2015', 'ES2016',
        'ES2017', 'ES2018',
        'ES2019', 'ES2020',
        'ES2021', 'ES2022',
        'ES2023', 'ESNext',
        'JSON',   'Latest'
    ]);
});

test('Get enum keys of "ModuleKind"', t => {
    enum ModuleKind {
        'None',     'CommonJS',
        'AMD',      'UMD',
        'System',   'ES2015',
        'ES2020',   'ES2022',
        'ESNext',   'Node16',
        'NodeNext', 'Preserve'
    }

    const keys = enumToKeyArray(ModuleKind);
    t.deepEqual(keys, [
        'None',     'CommonJS',
        'AMD',      'UMD',
        'System',   'ES2015',
        'ES2020',   'ES2022',
        'ESNext',   'Node16',
        'NodeNext', 'Preserve'
    ]);
});

test('Get enum keys of "Heterogeneus"', t => {
    enum Heterogeneus {
        FOO = 1,
        BAR = 2,
        BAK = 666,
        BAZ = 'LOL'
    }

    const keys = enumToKeyArray(Heterogeneus);
    t.deepEqual(keys, [
        'FOO',
        'BAR',
        'BAK',
        'BAZ',
    ]);
});