import { assert } from 'chai';
import { Meta } from './meta';

interface Data01 {
    text: string;
    value: number;
}

interface Data02 {
    id: number;
    active: boolean;
}

describe('Testing "@meta/meta"', () => {
    const meta01 = new Meta<Data01>();
    const meta02 = new Meta<Data02>();
    class Target { }

    describe('Set method', () => {
        it('Meta 01 value', () => {
            meta01.set(Target, {
                text: 'jajaja',
                value: 666
            });
        });
    
        it('Meta 02 value', () => {
            meta02.set(Target, {
                id: 666,
                active: true
            });
        });
    });

    describe('Get method', () => {
        it('Meta 01 value', () => {
            const data = meta01.get(Target);
            assert.isObject(data);
            assert.hasAllKeys(data, ['text', 'value']);
            assert.deepEqual(data, {
                text: 'jajaja',
                value: 666
            });
        });
        
        it('Meta 02 value', () => {
            const data = meta02.get(Target);
            assert.isObject(data);
            assert.hasAllKeys(data, ['id', 'active']);
            assert.deepEqual(data, {
                id: 666,
                active: true
            });
        });
    });
});