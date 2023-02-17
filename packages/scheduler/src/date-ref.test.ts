import test from 'ava';

import { DateRef } from './date-ref.js';

test('From new Date(2023, 1, 16, 12, 25)', t => {
    const target = new DateRef(new Date(2023, 1, 16, 12, 25));
    t.is(target.day, 4);
    t.is(target.hours, 12);
    t.is(target.minutes, 25);
    t.is(target.seconds, 0);
});

test('From new DateRef(4, 12, 25, 30)', t => {
    const target = new DateRef(4, 12, 25, 30);
    t.is(target.day, 4);
    t.is(target.hours, 12);
    t.is(target.minutes, 25);
    t.is(target.seconds, 30);
});

test('From new DateRef(4, 12, 25)', t => {
    const target = new DateRef(4, 12, 25);
    t.is(target.day, 4);
    t.is(target.hours, 12);
    t.is(target.minutes, 25);
    t.is(target.seconds, 0);
});

test('From new DateRef(4, 12)', t => {
    const target = new DateRef(4, 12);
    t.is(target.day, 4);
    t.is(target.hours, 12);
    t.is(target.minutes, 0);
    t.is(target.seconds, 0);
});

test('From new DateRef(4)', t => {
    const target = new DateRef(4);
    t.is(target.day, 4);
    t.is(target.hours, 0);
    t.is(target.minutes, 0);
    t.is(target.seconds, 0);
});

test('Check new DateRef(4, 12, 25, 30) === new DateRef(4, 12, 25, 30)', t => {
    const a = new DateRef(4, 12, 25, 30);
    const b = new DateRef(4, 12, 25, 30);

    t.true(a.isEquals(b));
    t.true(b.isEquals(a));
});

test('Check new DateRef(0, 0, 0, 0) === new DateRef(0, 0, 0)', t => {
    const a = new DateRef(0, 0, 0, 0);
    const b = new DateRef(0, 0, 0);

    t.true(a.isEquals(b));
    t.true(b.isEquals(a));
});

test('Check new DateRef(0, 0, 0, 0) === new DateRef(0, 0)', t => {
    const a = new DateRef(0, 0, 0, 0);
    const b = new DateRef(0, 0);

    t.true(a.isEquals(b));
    t.true(b.isEquals(a));
});

test('Check new DateRef(0, 0, 0, 0) === new DateRef(0)', t => {
    const a = new DateRef(0, 0, 0, 0);
    const b = new DateRef(0);

    t.true(a.isEquals(b));
    t.true(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 30) !== new DateRef(4, 12, 25)', t => {
    const a = new DateRef(4, 12, 25, 30);
    const b = new DateRef(4, 12, 25);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 30) !== new DateRef(4, 12)', t => {
    const a = new DateRef(4, 12, 25, 30);
    const b = new DateRef(4, 12);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 30) !== new DateRef(4)', t => {
    const a = new DateRef(4, 12, 25, 30);
    const b = new DateRef(4);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 35) !== new DateRef(4, 12, 25, 30)', t => {
    const a = new DateRef(4, 12, 25, 35);
    const b = new DateRef(4, 12, 25, 30);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 35) !== new DateRef(4, 12, 28)', t => {
    const a = new DateRef(4, 12, 25, 35);
    const b = new DateRef(4, 12, 28);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 35) !== new DateRef(4, 11)', t => {
    const a = new DateRef(4, 12, 25, 35);
    const b = new DateRef(4, 11);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Check new DateRef(4, 12, 25, 35) !== new DateRef(3)', t => {
    const a = new DateRef(4, 12, 25, 35);
    const b = new DateRef(3);

    t.false(a.isEquals(b));
    t.false(b.isEquals(a));
});

test('Convert new DateRef(4, 12, 25, 35)', t => {
    const target = new DateRef(4, 12, 25, 35);
    const result = target.toString();
    const revert = new DateRef(result);

    t.is(result, 'date-ref:4122535');
    t.is(revert.day, target.day);
    t.is(revert.hours, target.hours);
    t.is(revert.minutes, target.minutes);
    t.is(revert.seconds, target.seconds);
});

test('Copy instance', t => {
    const aaa = new DateRef(4, 12, 25, 35);
    const bbb = aaa.copy();

    t.is(aaa, aaa);
    t.not(aaa, bbb);
});

test('Add "day"', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('dd', 1);
    t.is(target.day, 1);
    t.is(target.hours, 0);
    t.is(target.minutes, 0);
    t.is(target.seconds, 0);
});

test('Add "hours"', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('hh', 1);
    t.is(target.day, 0);
    t.is(target.hours, 1);
    t.is(target.minutes, 0);
    t.is(target.seconds, 0);
});

test('Add "minutes"', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('mm', 1);
    t.is(target.day, 0);
    t.is(target.hours, 0);
    t.is(target.minutes, 1);
    t.is(target.seconds, 0);
});

test('Add "seconds"', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('ss', 1);
    t.is(target.day, 0);
    t.is(target.hours, 0);
    t.is(target.minutes, 0);
    t.is(target.seconds, 1);
});