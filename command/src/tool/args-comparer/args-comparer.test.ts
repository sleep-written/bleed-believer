import { assert } from 'chai';

import { ArgsComparer } from './args-comparer';
import { ArgsParser } from '../args-parser';

describe('Testing "./tool/args-comparer"', () => {
    it('Compare arguments: exp[ ] -> irl[ ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ ]),
            new ArgsParser([ ])
        );

        const resp = comp.isSimilar();
        assert.isTrue(resp);
    });

    it('Compare arguments: exp[ ] -> irl[ "hola" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ ]),
            new ArgsParser([ 'hola' ])
        );

        const resp = comp.isSimilar();
        assert.isFalse(resp);
    });

    it('Compare arguments: exp[ "hola", "mundo" ] -> irl[ "hola", "mundo" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ 'hola', 'mundo' ]),
            new ArgsParser([ 'hola', 'mundo' ])
        );

        const resp = comp.isSimilar();
        assert.isTrue(resp);
    });

    it('Compare arguments: exp[ "...lol" ] -> irl[ "foo", "bar", "baz" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ '...lol' ]),
            new ArgsParser([ 'foo', 'bar', 'baz' ])
        );

        const resp = comp.isSimilar();
        assert.isTrue(resp);
    });

    it('Compare arguments: exp[ "foo", "...lol" ] -> irl[ "foo", "bar", "baz" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ 'foo', '...lol' ]),
            new ArgsParser([ 'foo', 'bar', 'baz' ])
        );

        const resp = comp.isSimilar();
        assert.isTrue(resp);
    });

    it('Compare arguments: exp[ "foo", "...lol" ] -> irl[ "fck", "bar", "baz" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ 'foo', '...lol' ]),
            new ArgsParser([ 'fck', 'bar', 'baz' ])
        );

        const resp = comp.isSimilar();
        assert.isFalse(resp);
    });

    it('Compare arguments: exp[ "start", ":port" ] -> irl[ "start", "80" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ 'start', ':port' ]),
            new ArgsParser([ 'start', '80' ])
        );

        const resp = comp.isSimilar();
        assert.isTrue(resp);
    });

    it('Compare arguments: exp[ "start", ":port" ] -> irl[ "start", "80" ]', () => {
        const comp = new ArgsComparer(
            new ArgsParser([ 'start', ':port' ]),
            new ArgsParser([ 'start', '80' ])
        );

        const resp = comp.isSimilar();
        assert.isTrue(resp);
    });
});
