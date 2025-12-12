import { RegExxx } from './reg-exxx.js';
import test from 'ava';

test('Create a basic pattern', t => {
    const regExxx = new RegExxx([
        RegExxx.parenthesis([ /(?:^|;)\s*/, /\s+/ ]),
        /import/
    ], 'gi');

    t.is(regExxx.debug, [
        `RegExxx([`,
        `    RegExxx(/(?:(?:^|;)\\s*|\\s+)/),`,
        `    RegExxx(/import/)`,
        `], "gi")`,
    ].join('\n'));
});