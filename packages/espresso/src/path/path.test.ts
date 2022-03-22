import { assert } from 'chai';
import { Path } from './path';

describe('Testing "@espresso/path"', () => {
    describe('Path.fromClass', () => {
        it('Class "TestController"', () => {
            class TestController { }
            const name = Path.fromClass(TestController);
            assert.strictEqual(name, '/Test');
        });

        it('Class "ChavalLocoController"', () => {
            class ChavalLocoController { }
            const name = Path.fromClass(ChavalLocoController);
            assert.strictEqual(name, '/ChavalLoco');
        });

        it('Class "Chaval"', () => {
            class Chaval { }
            const name = Path.fromClass(Chaval);
            assert.strictEqual(name, '/Chaval');
        });
    });

    describe('Path.fromInstance', () => {
        it('Instance of "TestController"', () => {
            class TestController { }
            const name = Path.fromInstance(new TestController());
            assert.strictEqual(name, '/Test');
        });

        it('Instance of "ChavalLocoController"', () => {
            class ChavalLocoController { }
            const name = Path.fromInstance(new ChavalLocoController());
            assert.strictEqual(name, '/ChavalLoco');
        });

        it('Instance of "Chaval"', () => {
            class Chaval { }
            const name = Path.fromInstance(new Chaval());
            assert.strictEqual(name, '/Chaval');
        });
    });

    describe('Path.normalize', () => {
        it('convert: "hello-world"', () => {
            const path = Path.normalize('hello-world');
            assert.strictEqual(path, '/hello-world');
        });

        it('convert: "////// akjsdghskdj "', () => {
            const path = Path.normalize('////// akjsdghskdj ');
            assert.strictEqual(path, '/akjsdghskdj');
        });
        
        it('convert: " locked\\into\\phantasy"', () => {
            const path = Path.normalize(' locked\\into\\phantasy');
            assert.strictEqual(path, '/locked/into/phantasy');
        });
    });

    describe('Path.toLower', () => {
        it('Convert: "Hanipaganda"', () => {
            const resp = Path.toLower('Hanipaganda');
            assert.strictEqual(resp, 'hanipaganda');
        });

        it('Convert: "EdgeOfSanity"', () => {
            const resp = Path.toLower('EdgeOfSanity');
            assert.strictEqual(resp, 'edge-of-sanity');
        });

        it('Convert: "EresUnMalditooooo"', () => {
            const resp = Path.toLower('EresUnMalditooooo');
            assert.strictEqual(resp, 'eres-un-malditooooo');
        });

        it('Convert: "TypeORMcli"', () => {
            const resp = Path.toLower('TypeORMcli');
            assert.strictEqual(resp, 'type-orm-cli');
        });

        it('Convert: "TypeO-negative"', () => {
            const resp = Path.toLower('TypeO-negative');
            assert.strictEqual(resp, 'type-o-negative');
        });

        it('Convert: "/JoderChaval"', () => {
            const resp = Path.toLower('/JoderChaval');
            assert.strictEqual(resp, '/joder-chaval');
        });
    });
});