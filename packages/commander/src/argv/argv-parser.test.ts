import { assert } from 'chai';
import { ArgvParser } from './argv-parser';
import { ParserOptions } from './interfaces/parser-options';

describe('Testing "@commander/arg-parser"', () => {
    describe('linear = false', () => {
        const options: ParserOptions = {};

        it('Case 01', () => {
            const argv = ['hello', 'world'];
            const args = new ArgvParser(argv, options);
    
            assert.sameOrderedMembers(args.main, argv);
            assert.lengthOf(Object.keys(args.data), 0);
        });
    
        it('Case 02', () => {
            const argv = ['hello', 'world', '--foo', '--bar'];
            const args = new ArgvParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello', 'world']);
            assert.hasAllKeys(args.data, ['--foo', '--bar']);
        });
    
        it('Case 03', () => {
            const argv = ['hello', '--foo', 'true', 'world', '--bar', 'false'];
            const args = new ArgvParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello', 'world']);
            assert.hasAllKeys(args.data, ['--foo', '--bar']);
            assert.sameMembers(args.data['--foo'], ['true']);
            assert.sameMembers(args.data['--bar'], ['false']);
        });
    });

    describe('linear = true', () => {
        const options: ParserOptions = {
            linear: true
        };

        it('Case 01', () => {
            const argv = ['hello', 'world'];
            const args = new ArgvParser(argv, options);
    
            assert.sameOrderedMembers(args.main, argv);
            assert.lengthOf(Object.keys(args.data), 0);
        });
    
        it('Case 02', () => {
            const argv = ['hello', 'world', '--foo', '--bar'];
            const args = new ArgvParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello', 'world']);
            assert.hasAllKeys(args.data, ['--foo', '--bar']);
        });
    
        it('Case 03', () => {
            const argv = ['hello', '--foo', 'true', 'world', '--bar', 'false'];
            const args = new ArgvParser(argv, options);
    
            assert.sameOrderedMembers(args.main, ['hello']);
            assert.hasAllKeys(args.data, ['--foo', '--bar']);
            assert.sameMembers(args.data['--foo'], ['true', 'world']);
            assert.sameMembers(args.data['--bar'], ['false']);
        });
    });

    describe('Check casing', () => {
        const argv = ['hello', '--key-a', '666', '-KEY-A', '999'];

        it('lowercase = false', () => {
            const args = new ArgvParser(argv, { lowercase: false });
            const keys = Object.keys(args.data);

            assert.sameOrderedMembers(keys, ['--key-a', '--KEY-A']);
            assert.sameOrderedMembers(args.data['--key-a'], ['666']);
            assert.sameOrderedMembers(args.data['--KEY-A'], ['999']);
        });

        it('lowercase = true', () => {
            const args = new ArgvParser(argv, { lowercase: true });
            const keys = Object.keys(args.data);

            assert.sameOrderedMembers(keys, ['--key-a']);
            assert.sameOrderedMembers(args.data['--key-a'], ['666', '999']);
        });
    });

    describe('Match patterns', () => {
        describe('Case 01', () => {
            const patt = ['hello', 'world'];
            const real = ['hello', 'world'];

            it('lowercase: false', () => {
                const argv = new ArgvParser(real);
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: [],
                    param: {}
                });
            });
    
            it('lowercase: true', () => {
                const argv = new ArgvParser(real, {lowercase: true});
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: [],
                    param: {}
                });
            });
        });

        describe('Case 02', () => {
            const patt = ['hello', 'world'];
            const real = ['hello', 'WORLD'];

            it('lowercase: false', () => {
                const argv = new ArgvParser(real);
                const data = argv.match(patt);
                assert.isNull(data);
            });
    
            it('lowercase: true', () => {
                const argv = new ArgvParser(real, {lowercase: true});
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: [],
                    param: {}
                });
            });
        });

        describe('Case 03', () => {
            const patt = ['copy', ':path01', ':path02'];
            const real = ['copy', './file-a', './file-b'];

            it('lowercase: false', () => {
                const argv = new ArgvParser(real);
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: [],
                    param: {
                        path01: './file-a',
                        path02: './file-b',
                    }
                });
            });
    
            it('lowercase: true', () => {
                const argv = new ArgvParser(real, {lowercase: true});
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: [],
                    param: {
                        path01: './file-a',
                        path02: './file-b',
                    }
                });
            });
        });

        describe('Case 04', () => {
            const patt = ['kill', '...'];
            const real = ['kill', '555', '666', '777'];

            it('lowercase: false', () => {
                const argv = new ArgvParser(real);
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: ['555', '666', '777'],
                    param: {}
                });
            });
    
            it('lowercase: true', () => {
                const argv = new ArgvParser(real, {lowercase: true});
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: ['555', '666', '777'],
                    param: {}
                });
            });
        });

        describe('Case 05', () => {
            const patt = ['select', ':file', 'to', '...'];
            const real = ['select', './secret.aes', 'to', 'inferno', 'cop'];

            it('lowercase: false', () => {
                const argv = new ArgvParser(real);
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: ['inferno', 'cop'],
                    param: {
                        file: './secret.aes'
                    }
                });
            });
    
            it('lowercase: true', () => {
                const argv = new ArgvParser(real, {lowercase: true});
                const data = argv.match(patt);
                assert.isNotNull(data);
                assert.deepEqual(data, {
                    items: ['inferno', 'cop'],
                    param: {
                        file: './secret.aes'
                    }
                });
            });
        });
    });
});