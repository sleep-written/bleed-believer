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

test('Add "hours" (overflow)', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('hh', 30);
    t.is(target.day, 1);
    t.is(target.hours, 6);
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

test('Add "minutes" (overflow)', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('mm', 75);
    t.is(target.day, 0);
    t.is(target.hours, 1);
    t.is(target.minutes, 15);
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

test('Add "seconds" (overflow)', t => {
    const target = new DateRef(0, 0, 0, 0);
    target.add('ss', 75);
    t.is(target.day, 0);
    t.is(target.hours, 0);
    t.is(target.minutes, 1);
    t.is(target.seconds, 15);
});

test('Interval 1h', t => {
    const intervals = DateRef
        .getIntervals(1, 1)
        .map(x => x.toString());

    t.deepEqual(intervals, [
        'date-ref:1000000',
        'date-ref:1010000',
        'date-ref:1020000',
        'date-ref:1030000',
        'date-ref:1040000',
        'date-ref:1050000',
        'date-ref:1060000',
        'date-ref:1070000',
        'date-ref:1080000',
        'date-ref:1090000',
        'date-ref:1100000',
        'date-ref:1110000',
        'date-ref:1120000',
        'date-ref:1130000',
        'date-ref:1140000',
        'date-ref:1150000',
        'date-ref:1160000',
        'date-ref:1170000',
        'date-ref:1180000',
        'date-ref:1190000',
        'date-ref:1200000',
        'date-ref:1210000',
        'date-ref:1220000',
        'date-ref:1230000',
    ]);
});

test('Interval 30m', t => {
    const intervals = DateRef
        .getIntervals(1, 0, 30)
        .map(x => x.toString())
        .slice(0, 5);

    t.deepEqual(intervals, [
        'date-ref:1000000',
        'date-ref:1003000',
        'date-ref:1010000',
        'date-ref:1013000',
        'date-ref:1020000',
    ]);
});

test('Interval 5s', t => {
    const intervals = DateRef
        .getIntervals(1, 0, 0, 5)
        .map(x => x.toString())
        .slice(0, 5);

    t.deepEqual(intervals, [
        'date-ref:1000000',
        'date-ref:1000005',
        'date-ref:1000010',
        'date-ref:1000015',
        'date-ref:1000020',
    ]);
});