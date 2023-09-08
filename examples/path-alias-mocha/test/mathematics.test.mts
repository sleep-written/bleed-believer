import { mathematics } from '@app/mathematics.mjs';
import { assert } from 'chai';

it('2 + 3 = 5', () => {
    const a = 2;
    const b = 3;
    
    const r = mathematics(a, b);
    assert.strictEqual(r, 5);
});

it('8 + 2 = 10', () => {
    const a = 8;
    const b = 2;
    
    const r = mathematics(a, b);
    assert.strictEqual(r, 10);
});