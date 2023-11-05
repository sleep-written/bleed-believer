import test from 'ava';
import { mathematics } from './mathematics.js';

test('2 + 2 = 4', t => {
    const r = mathematics(2, 2);
    t.is(r, 4);
});