import test from 'ava';
import { ExtParser } from './ext-parser.js';

test('Check "./joder/chaval.ts"', t => {
    const target = new ExtParser('./joder/chaval.ts');
    t.true(target.isTs()); 
    t.false(target.isJs()); 
});

test('Check "./joder/chaval.js"', t => {
    const target = new ExtParser('./joder/chaval.js');
    t.false(target.isTs()); 
    t.true(target.isJs()); 
});

test('Convert "./joder/chaval.ts" -> "./joder/chaval.js"', t => {
    const target = new ExtParser('./joder/chaval.ts');
    t.is(target.toJs(), './joder/chaval.js');
});

test('Convert "./joder/chaval.js" -> "./joder/chaval.ts"', t => {
    const target = new ExtParser('./joder/chaval.js');
    t.is(target.toTs(), './joder/chaval.ts');
});