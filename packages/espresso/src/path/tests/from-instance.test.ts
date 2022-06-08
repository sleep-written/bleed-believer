import test from 'ava';

import { Path } from '../path.js';

test('Instance of "TestController"', t => {
    class TestController { }
    const name = Path.fromInstance(new TestController());
    t.is(name, '/Test');
});

test('Instance of "ChavalLocoController"', t => {
    class ChavalLocoController { }
    const name = Path.fromInstance(new ChavalLocoController());
    t.is(name, '/ChavalLoco');
});

test('Instance of "Chaval"', t => {
    class Chaval { }
    const name = Path.fromInstance(new Chaval());
    t.is(name, '/Chaval');
});