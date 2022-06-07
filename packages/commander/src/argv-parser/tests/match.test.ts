import test from 'ava';
import { ArgvParser } from '../argv-parser.js';

test('Pattern: "hello world", Args: "hello"', t => {
    const argv = new ArgvParser(['hello']);
    const data = argv.match(['hello', 'world']);

    t.falsy(data);
});

test('Pattern: "hello", Args: "hello world"', t => {
    const argv = new ArgvParser(['hello', 'world']);
    const data = argv.match(['hello']);

    t.falsy(data);
});

test('Pattern: "hello world", Args: "hello world"', t => {
    const argv = new ArgvParser(['hello', 'world']);
    const data = argv.match(['hello', 'world']);

    t.truthy(data?.items);
    t.truthy(data?.param);

    t.is(data?.items.length, 0);
    t.is(Object.keys(data?.param ?? {}).length, 0);
});

test('Pattern: "copy :file1 :file2", Args: "copy ./file-01.txt ./file-02.txt"', t => {
    const argv = new ArgvParser(['copy', './file-01.txt', './file-02.txt']);
    const data = argv.match(['copy', ':file1', ':file2']);

    t.is(data?.items?.length, 0);
    t.deepEqual(data?.param, {
        file1: './file-01.txt',
        file2: './file-02.txt',
    });
});

test('Pattern: "kill ...", Args: "kill', t => {
    const argv = new ArgvParser(['kill']);
    const data = argv.match(['kill', '...']);

    t.truthy(data);
    t.is(data?.items?.length, 0);
});

test('Pattern: "kill ...", Args: "kill runcobol node nodemon', t => {
    const argv = new ArgvParser(['kill', 'runcobol', 'node', 'nodemon']);
    const data = argv.match(['kill', '...']);

    t.is(Object.keys(data?.param ?? {}).length, 0);
    t.deepEqual(data?.items, ['runcobol', 'node', 'nodemon']);
});

test('Pattern: "kill ...", Args: "kill runcobol node nodemon --silent', t => {
    const argv = new ArgvParser(['kill', 'runcobol', 'node', 'nodemon', '--silent']);
    const data = argv.match(['kill', '...']);

    t.is(Object.keys(data?.param ?? {}).length, 0);
    t.deepEqual(data?.items, ['runcobol', 'node', 'nodemon']);
});