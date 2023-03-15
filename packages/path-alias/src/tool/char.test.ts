import test from 'ava';
import { Char } from './char.js';

test('new Char of "U"', t => {
    const char = new Char('U');
    t.is(char.codePoint, 85);
    t.is(char.toString(), 'U');

    t.true(char.isAlphabet);
    t.true(char.isUpperCase);
    t.false(char.isLowerCase);

    t.is(char.toUpperCase().toString(), 'U');
    t.is(char.toLowerCase().toString(), 'u');
});

test('new Char of "u"', t => {
    const char = new Char('u');
    t.is(char.codePoint, 117);
    t.is(char.toString(), 'u');

    t.true(char.isAlphabet);
    t.true(char.isLowerCase);
    t.false(char.isUpperCase);

    t.is(char.toUpperCase().toString(), 'U');
    t.is(char.toLowerCase().toString(), 'u');
});

test('new Char of "🤪"', t => {
    const char = new Char('🤪');
    t.is(char.codePoint, 129322);
    t.is(char.toString(), '🤪');

    t.false(char.isAlphabet);
    t.false(char.isLowerCase);
    t.false(char.isUpperCase);

    t.is(char.toUpperCase().toString(), '🤪');
    t.is(char.toLowerCase().toString(), '🤪');
});
