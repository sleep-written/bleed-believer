import { assert } from 'chai';

import { CONTROLLER, Controller } from './controller';
import { DuplicatedEndpointError, Get, Post } from '../endpoint';

describe.only('Testing "@espresso/endpoint"', () => {
    it('Controller 01', () => {
        class Target extends Controller {
            @Get()
            async find(): Promise<void> { }
        }

        const meta = CONTROLLER.get(Target);
        assert.isObject(meta);
        assert.deepEqual(meta, {
            path: 'Target',
            endpoints: [
                { key: 'find', method: 'get' }
            ]
        });
    });

    it('Controller 02', () => {
        class Target extends Controller {
            @Get()
            async find(): Promise<void> { }

            @Get(':id')
            async findOne(): Promise<void> { }
        }

        const meta = CONTROLLER.get(Target);
        assert.isObject(meta);
        assert.deepEqual(meta, {
            path: 'Target',
            endpoints: [
                { key: 'find',      method: 'get' },
                { key: 'findOne',   method: 'get', path: ':id' },
            ]
        });
    });

    it('Controller 03 (same path, distinct method)', () => {
        class Target extends Controller {
            @Get()
            async find(): Promise<void> { }

            @Post()
            async save(): Promise<void> { }
        }

        const meta = CONTROLLER.get(Target);
        assert.isObject(meta);
        assert.deepEqual(meta, {
            path: 'Target',
            endpoints: [
                { key: 'find', method: 'get' },
                { key: 'save', method: 'post' },
            ]
        });
    });

    it('Controller 04 (duplicated endpoint)', () => {
        try {
            class Target extends Controller {
                @Get()
                async find(): Promise<void> { }
    
                @Get()
                async findOne(): Promise<void> { }
            }

            throw new Error('Fail!');
        } catch (err) {
            assert.instanceOf(err, DuplicatedEndpointError);
        }
    });
});