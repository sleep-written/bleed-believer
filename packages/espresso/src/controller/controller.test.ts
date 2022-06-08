import test from 'ava';

import { DuplicatedEndpointError } from '../errors/index.js';
import { CONTROLLER, Controller } from './controller.js';
import { ControllerPath } from './controller-path.js';
import { Get, Post } from '../endpoint/index.js';

test('Controller 01', t => {
    class Target extends Controller {
        @Get()
        async find(): Promise<void> { }
    }

    const meta = CONTROLLER.get(Target);
    t.deepEqual(meta, {
        endpoints: [
            { key: 'find', method: 'get' }
        ]
    });
});

test('Controller 02', t => {
    class Target extends Controller {
        @Get()
        async find(): Promise<void> { }

        @Get(':id')
        async findOne(): Promise<void> { }
    }

    const meta = CONTROLLER.get(Target);
    t.deepEqual(meta, {
        endpoints: [
            { key: 'find',      method: 'get' },
            { key: 'findOne',   method: 'get', path: '/:id' },
        ]
    });
});

test('Controller 03 (same path, distinct method)', t => {
    class Target extends Controller {
        @Get()
        async find(): Promise<void> { }

        @Post()
        async save(): Promise<void> { }
    }

    const meta = CONTROLLER.get(Target);
    t.deepEqual(meta, {
        endpoints: [
            { key: 'find', method: 'get' },
            { key: 'save', method: 'post' },
        ]
    });
});

test('Controller 04 (duplicated endpoint)', t => {
    t.throws(
        () => {
            class Target extends Controller {
                @Get()
                async find(): Promise<void> { }
        
                @Get()
                async findOne(): Promise<void> { }
            }
        
            throw new Error('Fail!');
        }, {
            instanceOf: DuplicatedEndpointError
        }
    );
});

test('Controller 05 (custom path)', t => {
    @ControllerPath('jajaja')
    class Target extends Controller {
        @Get()
        find(): void { }
    }

    const meta = CONTROLLER.get(Target);
    t.deepEqual(meta, {
        path: '/jajaja',
        endpoints: [
            { key: 'find', method: 'get' }
        ]
    });
});