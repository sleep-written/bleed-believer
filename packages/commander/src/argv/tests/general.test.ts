import test from 'ava';
import { ArgvParser } from '../argv-parser.js';

test('Parse "hello world"', t => {
    const argv = new ArgvParser(
        ['hello', 'world']
    );

    t.deepEqual(argv.main, ['hello', 'world']);
    t.is(Object.keys(argv.data).length, 0);
});

test('Parse "hello world --lol"', t => {
    const argv = new ArgvParser(['hello', 'world', '--lol']);

    t.deepEqual(argv.main, ['hello', 'world']);
    t.true(Object.keys(argv.data).some(x => x === '--lol'));
});

test('Parse "hello world --lol kek"', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek']
    );

    t.deepEqual(argv.main, ['hello', 'world']);
    t.deepEqual(argv.data['--lol'], ['kek']);
});

test('Parse "hello world --lol kek jej ñee"', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek', 'jej', 'ñee']
    );

    t.deepEqual(argv.main, ['hello', 'world', 'jej', 'ñee']);
    t.deepEqual(argv.data['--lol'], ['kek']);
});

test('Parse "hello world --lol kek jej ñee" (linear)', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek', 'jej', 'ñee'],
        { linear: true }
    );

    t.deepEqual(argv.main, ['hello', 'world']);
    t.deepEqual(argv.data['--lol'], ['kek', 'jej', 'ñee']);
});

test('Parse "hello world --lol kek jej ñee --foo bar"', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek', 'jej', 'ñee', '--foo', 'bar']
    );

    t.deepEqual(argv.main, ['hello', 'world', 'jej', 'ñee']);
    t.deepEqual(argv.data['--lol'], ['kek']);
    t.deepEqual(argv.data['--foo'], ['bar']);
});

test('Parse "hello world --lol kek jej ñee --foo bar" (linear)', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek', 'jej', 'ñee', '--foo', 'bar'],
        { linear: true }
    );

    t.deepEqual(argv.main, ['hello', 'world']);
    t.deepEqual(argv.data['--lol'], ['kek', 'jej', 'ñee']);
    t.deepEqual(argv.data['--foo'], ['bar']);
});

test('Parse "hello world --lol kek --foo bar --LOL iei"', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek', '--foo', 'bar', '--LOL', 'iei']
    );

    t.deepEqual(argv.main, ['hello', 'world']);
    t.deepEqual(argv.data['--lol'], ['kek']);
    t.deepEqual(argv.data['--foo'], ['bar']);
    t.deepEqual(argv.data['--LOL'], ['iei']);
});

test('Parse "hello world --lol kek --foo bar --LOL iei" (lowercase)', t => {
    const argv = new ArgvParser(
        ['hello', 'world', '--lol', 'kek', '--foo', 'bar', '--LOL', 'iei'],
        { lowercase: true }
    );

    t.deepEqual(argv.main, ['hello', 'world']);
    t.deepEqual(argv.data['--lol'], ['kek', 'iei']);
    t.deepEqual(argv.data['--foo'], ['bar']);
});