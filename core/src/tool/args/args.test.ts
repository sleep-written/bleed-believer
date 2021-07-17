import { assert } from 'chai';
import { Args } from './args';

describe('Testing "command/tool/args"', () => {
    it('Read "hello world"', () => {
        const args = new Args([ 'hello', 'world' ]);

        assert.strictEqual(args.main.length, 2);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
    });

    it('Read "hello world --key value"', () => {
        const args = new Args([ 'hello', 'world', '--key', 'value' ]);

        assert.lengthOf(args.main, 2);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');

        const paramA = args.find('--key');
        assert.isNotNull(paramA);
        assert.lengthOf(paramA, 1);
        assert.strictEqual(paramA[0], 'value');

        const paramB = args.find('-key');
        assert.isNotNull(paramB);
        assert.lengthOf(paramB, 1);
        assert.strictEqual(paramB[0], 'value');

        const paramC = args.find('key');
        assert.isNotNull(paramC);
        assert.lengthOf(paramC, 1);
        assert.strictEqual(paramC[0], 'value');
    });

    it('Read "hello world -key value"', () => {
        const args = new Args([ 'hello', 'world', '-key', 'value' ]);

        assert.lengthOf(args.main, 2);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');

        const paramA = args.find('--key');
        assert.isNotNull(paramA);
        assert.lengthOf(paramA, 1);
        assert.strictEqual(paramA[0], 'value');

        const paramB = args.find('-key');
        assert.isNotNull(paramB);
        assert.lengthOf(paramB, 1);
        assert.strictEqual(paramB[0], 'value');

        const paramC = args.find('key');
        assert.isNotNull(paramC);
        assert.lengthOf(paramC, 1);
        assert.strictEqual(paramC[0], 'value');
    });

    it('Read "hello world --key value bastard"', () => {
        const args = new Args([
            'hello', 'world', '--key', 'value', 'bastard'
        ]);

        assert.lengthOf(args.main, 3);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
        assert.strictEqual(args.main[2], 'bastard');

        const param = args.find('key');
        assert.isNotNull(param);
        assert.lengthOf(param, 1);
        assert.strictEqual(param[0], 'value');
    });

    it('Read "hello world -key value bastard"', () => {
        const args = new Args([
            'hello', 'world', '-key', 'value', 'bastard'
        ]);

        assert.lengthOf(args.main, 3);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
        assert.strictEqual(args.main[2], 'bastard');

        const param = args.find('key');
        assert.isNotNull(param);
        assert.lengthOf(param, 1);
        assert.strictEqual(param[0], 'value');
    });

    it('Read "hello world --key val-a bastard --key val-b"', () => {
        const args = new Args([
            'hello', 'world', '--key', 'val-a', 'bastard', '--key', 'val-b'
        ]);

        assert.lengthOf(args.main, 3);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
        assert.strictEqual(args.main[2], 'bastard');

        const param = args.find('key');
        assert.isNotNull(param);
        assert.lengthOf(param, 2);
        assert.strictEqual(param[0], 'val-a');
        assert.strictEqual(param[1], 'val-b');
    });

    it('Read "hello world -key val-a bastard -key val-b"', () => {
        const args = new Args([
            'hello', 'world', '-key', 'val-a', 'bastard', '-key', 'val-b'
        ]);

        assert.lengthOf(args.main, 3);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
        assert.strictEqual(args.main[2], 'bastard');

        const param = args.find('key');
        assert.isNotNull(param);
        assert.lengthOf(param, 2);
        assert.strictEqual(param[0], 'val-a');
        assert.strictEqual(param[1], 'val-b');
    });

    it('Read "hello world --key val-a bastard --key val-b --other value fuck you"', () => {
        const args = new Args([
            'hello', 'world', '--key', 'val-a', 'bastard',
            '--key', 'val-b', '--other', 'value', 'fuck', 'you'
        ]);

        assert.lengthOf(args.main, 5);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
        assert.strictEqual(args.main[2], 'bastard');
        assert.strictEqual(args.main[3], 'fuck');
        assert.strictEqual(args.main[4], 'you');

        const paramA = args.find('key');
        assert.isNotNull(paramA);
        assert.lengthOf(paramA, 2);
        assert.strictEqual(paramA[0], 'val-a');
        assert.strictEqual(paramA[1], 'val-b');
        
        const paramB = args.find('other');
        assert.isNotNull(paramB);
        assert.lengthOf(paramB, 1);
        assert.strictEqual(paramB[0], 'value');
    });

    it('Read "hello world -key val-a bastard -key val-b -other value fuck you"', () => {
        const args = new Args([
            'hello', 'world', '-key', 'val-a', 'bastard',
            '-key', 'val-b', '-other', 'value', 'fuck', 'you'
        ]);

        assert.lengthOf(args.main, 5);
        assert.strictEqual(args.main[0], 'hello');
        assert.strictEqual(args.main[1], 'world');
        assert.strictEqual(args.main[2], 'bastard');
        assert.strictEqual(args.main[3], 'fuck');
        assert.strictEqual(args.main[4], 'you');

        const paramA = args.find('key');
        assert.isNotNull(paramA);
        assert.lengthOf(paramA, 2);
        assert.strictEqual(paramA[0], 'val-a');
        assert.strictEqual(paramA[1], 'val-b');
        
        const paramB = args.find('other');
        assert.isNotNull(paramB);
        assert.lengthOf(paramB, 1);
        assert.strictEqual(paramB[0], 'value');
    });

    it('Read current execution', () => {
        const args = new Args();
        const param = args.find('require');

        assert.lengthOf(args.main, 1);
        assert.strictEqual(args.main[0], './src/**/*.test.ts');
        
        assert.lengthOf(param, 1);
        assert.strictEqual(param[0], 'ts-node/register');
    });
});