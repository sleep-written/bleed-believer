import { assert } from 'chai';
import { Path } from './path';

describe('Testing "@espresso/path"', () => {
    describe('Path.fromClass', () => {
        it('Case 01', () => {
            class TestController { }
            const name = Path.fromClass(TestController);
            assert.strictEqual(name, '/Test');
        });

        it('Case 02', () => {
            class ChavalLocoController { }
            const name = Path.fromClass(ChavalLocoController);
            assert.strictEqual(name, '/ChavalLoco');
        });

        it('Case 03', () => {
            class Chaval { }
            const name = Path.fromClass(Chaval);
            assert.strictEqual(name, '/Chaval');
        });
    });

    describe('Path.fromInstance', () => {
        it('Case 01', () => {
            class TestController { }
            const name = Path.fromInstance(new TestController());
            assert.strictEqual(name, '/Test');
        });

        it('Case 02', () => {
            class ChavalLocoController { }
            const name = Path.fromInstance(new ChavalLocoController());
            assert.strictEqual(name, '/ChavalLoco');
        });

        it('Case 03', () => {
            class Chaval { }
            const name = Path.fromInstance(new Chaval());
            assert.strictEqual(name, '/Chaval');
        });
    });

    describe('Path.normalize', () => {
        it('Case 01', () => {
            const path = Path.normalize('hello-world');
            assert.strictEqual(path, '/hello-world');
        });

        it('Case 01', () => {
            const path = Path.normalize('////// akjsdghskdj ');
            assert.strictEqual(path, '/akjsdghskdj');
        });
        
        it('Case 03', () => {
            const path = Path.normalize(' locked\\into\\phantasy');
            assert.strictEqual(path, '/locked/into/phantasy');
        });
    });
});