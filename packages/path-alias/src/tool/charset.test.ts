import test from 'ava';
import { Charset } from './charset.js';

test('"hello world" at(...)', t => {
    const target = new Charset('hello world');
    t.is(target.at(0)?.toString(), 'h');
    t.is(target.at(6)?.toString(), 'w');
    t.is(target.at(-1)?.toString(), 'd');
    t.is(target.at(-5)?.toString(), 'w');
});

test('Replace "HELLO WORLD" at pos 4 with "e"', t => {
    const target = new Charset('HELLO WORLD');
    const result = target
        .replaceAt(4, 'e')
        .toString();

    t.is(target.toString(), 'HELLO WORLD');
    t.is(result, 'HELLe WORLD');
});

test('Replace "hello world" at pos 4 with "E"', t => {
    const target = new Charset('hello world');
    const result = target
        .replaceAt(4, 'E')
        .toString();

    t.is(target.toString(), 'hello world');
    t.is(result, 'hellE world');
});

test('Replace "HELLO WORLD" at pos 4 with "e", keepCasing = true', t => {
    const target = new Charset('HELLO WORLD');
    const result = target
        .replaceAt(4, 'e', true)
        .toString();

    t.is(target.toString(), 'HELLO WORLD');
    t.is(result, 'HELLE WORLD');
});

test('Replace "hello world" at pos 4 with "E", keepCasing = true', t => {
    const target = new Charset('hello world');
    const result = target
        .replaceAt(4, 'E', true)
        .toString();

    t.is(target.toString(), 'hello world');
    t.is(result, 'helle world');
});

test('Replace "0123456789" at pos -2 with "G"', t => {
    const target = new Charset('0123456789');
    const result = target
        .replaceAt(-2, 'G')
        .toString();

    t.is(result, '01234567G9');
});

test('Replace "0123456789" at pos -8 with "G"', t => {
    const target = new Charset('0123456789');
    const result = target
        .replaceAt(-8, 'G')
        .toString();

    t.is(result, '01G3456789');
});
