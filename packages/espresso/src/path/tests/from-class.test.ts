import test from 'ava';

import { Path } from '../path.js';

test('Class "TestController"', t => {
    class TestController { }
    const name = Path.fromClass(TestController);
    t.is(name, '/Test');
});

test('Class "ChavalLocoController"', t => {
    class ChavalLocoController { }
    const name = Path.fromClass(ChavalLocoController);
    t.is(name, '/ChavalLoco');
});

test('Class "Chaval"', t => {
    class Chaval { }
    const name = Path.fromClass(Chaval);
    t.is(name, '/Chaval');
});