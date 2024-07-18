import { ObjectMutator } from './object-mutator.js';
import test from 'ava';

test('Get Case 01', t => {
    const mutator = new ObjectMutator<any>({
        text: 'ñeee',
        value: 111
    });

    t.is(mutator.get('text'), 'ñeee');
    t.is(mutator.get('value'), 111);
});

test('Get Case 02', t => {
    const mutator = new ObjectMutator<any>({
        text: 'ñeee',
        value: 111,
        parameter: {
            set: true,
            id: 99999
        },
        coco: {
            grita: [
                {
                    id: 55,
                    text: 'hijos'
                },
                {
                    id: 56,
                    text: 'de'
                },
                {
                    id: 57,
                    text: 'puta'
                }
            ]
        }
    });

    t.is(mutator.get('text'), 'ñeee');
    t.is(mutator.get('value'), 111);
    t.is(mutator.get('coco.grita.0.id'), 55);
    t.is(mutator.get('coco.grita.0.text'), 'hijos');
    t.is(mutator.get('coco.grita.1.id'), 56);
    t.is(mutator.get('coco.grita.1.text'), 'de');
    t.is(mutator.get('coco.grita.2.id'), 57);
    t.is(mutator.get('coco.grita.2.text'), 'puta');
});

test('Set Case 01', t => {
    const mutator = new ObjectMutator<any>({
        text: 'ñeee',
        value: 111
    });

    mutator.set('strength', 666);
    t.deepEqual(mutator.value, {
        text: 'ñeee',
        value: 111,
        strength: 666
    });
});

test('Set Case 02', t => {
    const mutator = new ObjectMutator<any>({
        text: 'ñeee',
        value: 111
    });

    mutator.set('parameter.set', true);
    mutator.set('parameter.id', 99999);
    mutator.set('coco.grita.0.id', 55);
    mutator.set('coco.grita.0.text', 'hijos');
    mutator.set('coco.grita.1.id', 56);
    mutator.set('coco.grita.1.text', 'de');
    mutator.set('coco.grita.2.id', 57);
    mutator.set('coco.grita.2.text', 'puta');
    t.deepEqual(mutator.value, {
        text: 'ñeee',
        value: 111,
        parameter: {
            set: true,
            id: 99999
        },
        coco: {
            grita: [
                {
                    id: 55,
                    text: 'hijos'
                },
                {
                    id: 56,
                    text: 'de'
                },
                {
                    id: 57,
                    text: 'puta'
                }
            ]
        }
    });
});
