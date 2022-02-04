import { assert } from 'chai';
import { ArgParser } from './arg-parser';
import { ParserOptions } from './interfaces/parser-options';

describe('Testing "@bleed-believer/command/tool/arg-parser"', () => {
    describe('linear = false', () => {
        const options: ParserOptions = {};

        it('Case 01', () => {
            const argv = ['hello', 'world'];
            const args = new ArgParser(argv, options);
    
            assert.sameOrderedMembers(args.main, argv);
            assert.lengthOf(Object.keys(args.args), 0);
        });
    
        it('Case 02', () => {
            const argv = ['hello', 'world', '--foo', '--bar'];
            const args = new ArgParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello', 'world']);
            assert.hasAllKeys(args.args, ['--foo', '--bar']);
        });
    
        it('Case 03', () => {
            const argv = ['hello', '--foo', 'true', 'world', '--bar', 'false'];
            const args = new ArgParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello', 'world']);
            assert.hasAllKeys(args.args, ['--foo', '--bar']);
            assert.sameMembers(args.args['--foo'], ['true']);
            assert.sameMembers(args.args['--bar'], ['false']);
        });
    });

    describe('linear = true', () => {
        const options: ParserOptions = {
            linear: true
        };

        it('Case 01', () => {
            const argv = ['hello', 'world'];
            const args = new ArgParser(argv, options);
    
            assert.sameOrderedMembers(args.main, argv);
            assert.lengthOf(Object.keys(args.args), 0);
        });
    
        it('Case 02', () => {
            const argv = ['hello', 'world', '--foo', '--bar'];
            const args = new ArgParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello', 'world']);
            assert.hasAllKeys(args.args, ['--foo', '--bar']);
        });
    
        it('Case 03', () => {
            const argv = ['hello', '--foo', 'true', 'world', '--bar', 'false'];
            const args = new ArgParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello']);
            assert.hasAllKeys(args.args, ['--foo', '--bar']);
            assert.sameMembers(args.args['--foo'], ['true', 'world']);
            assert.sameMembers(args.args['--bar'], ['false']);
        });
    });

    describe('Check casing', () => {
        const argv = ['hello', '--key-a', '666', '-KEY-A', '999'];

        it('lowercase = false', () => {
            const args = new ArgParser(argv, { lowercase: false });
            const keys = Object.keys(args.args);

            assert.sameOrderedMembers(keys, ['--key-a', '--KEY-A']);
            assert.sameOrderedMembers(args.args['--key-a'], ['666']);
            assert.sameOrderedMembers(args.args['--KEY-A'], ['999']);
        });

        it('lowercase = true', () => {
            const args = new ArgParser(argv, { lowercase: true });
            const keys = Object.keys(args.args);

            assert.sameOrderedMembers(keys, ['--key-a']);
            assert.sameOrderedMembers(args.args['--key-a'], ['666', '999']);
        });
    });
});