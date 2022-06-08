import test from 'ava';

import { Path } from '../path.js';

test('Convert: "Hanipaganda"', t => {
    const resp = Path.toLower('Hanipaganda');
    t.is(resp, 'hanipaganda');
});

test('Convert: "EdgeOfSanity"', t => {
    const resp = Path.toLower('EdgeOfSanity');
    t.is(resp, 'edge-of-sanity');
});

test('Convert: "EresUnMalditooooo"', t => {
    const resp = Path.toLower('EresUnMalditooooo');
    t.is(resp, 'eres-un-malditooooo');
});

test('Convert: "TypeORMcli"', t => {
    const resp = Path.toLower('TypeORMcli');
    t.is(resp, 'type-orm-cli');
});

test('Convert: "TypeO-negative"', t => {
    const resp = Path.toLower('TypeO-negative');
    t.is(resp, 'type-o-negative');
});

test('Convert: "/JoderChaval"', t => {
    const resp = Path.toLower('/JoderChaval');
    t.is(resp, '/joder-chaval');
});