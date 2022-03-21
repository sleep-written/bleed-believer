import { assert } from 'chai';

import { DuplicatedEndpointError } from '../errors';
import { CONTROLLER, Controller } from './controller';
import { ControllerPath } from './controller-path';
import { Get, Post } from '../endpoint';

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

    it('Controller 05 (custom path)', () => {
        @ControllerPath('jajaja')
        class Target extends Controller {
            @Get()
            find(): void { }
        }

        const meta = CONTROLLER.get(Target);
        assert.isObject(meta);
        assert.deepEqual(meta, {
            path: 'jajaja',
            endpoints: [
                { key: 'find', method: 'get' }
            ]
        });
    });
});