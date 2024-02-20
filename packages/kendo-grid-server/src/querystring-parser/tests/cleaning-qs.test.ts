import test, { type ExecutionContext } from 'ava';
import { QuerystringParser } from '../querystring-parser.js';

function buildTest<T>(
    url: string,
    callback: (
        t: ExecutionContext,
        o: QuerystringParser
    ) => void
): void {
    return test(`Testing URL "${url}"`, t => {
        const o = new QuerystringParser(url);
        return callback(t, o);
    });
}

buildTest('ja/ja/ja', (t, o) => {
    t.is(o.querystring, '');
});

buildTest('ja/ja/ja?$top=10&$skip=0', (t, o) => {
    t.is(o.querystring, '$top=10&$skip=0');
});

buildTest('ja/ja/ja?????????$top=10&$skip=0', (t, o) => {
    t.is(o.querystring, '$top=10&$skip=0');
});