import { ControllerRouting, CONTROLLER_ROUTING } from './controller-routing';
import { Controller } from '../controller';
import { Get, Post } from '../endpoint';
import { assert } from 'chai';
import { CONTROLLER } from '../controller/controller';

describe.only('Testing "@espresso/controller-routing"', () => {
    class User extends Controller {
        @Post('login')
        login(): void {}

        @Get(':id')
        findOne(): void {}

        @Post()
        save(): void {}
    }

    class Quotation extends Controller {
        @Get(':id')
        findOne(): void {}

        @Post()
        save(): void {}
    }

    class Contract extends Controller {
        @Get(':id')
        findOne(): void {}

        @Post()
        save(): void {}
    }

    @ControllerRouting({
        path: 'Documents',
        controllers: [
            Quotation,
            Contract
        ]
    })
    class DocumentsRouting {}

    @ControllerRouting({
        controllers:    [ User ],
        routes:         [ DocumentsRouting ]
    })
    class ApiRouting {}

    it('Check Nested Route', () => {
        const meta = CONTROLLER_ROUTING.get(DocumentsRouting);
        assert.isObject(meta);
        assert.hasAllKeys(meta, [ 'controllers', 'routes', 'path' ]);
        assert.lengthOf(meta.controllers, 2);
        assert.lengthOf(meta.routes, 0);
        assert.strictEqual(meta.path, 'Documents');

        const metaCtrl0 = CONTROLLER.get(meta.controllers[0]);
        assert.deepEqual(metaCtrl0, {
            path: 'Quotation',
            endpoints: [
                { method: 'get',   key: 'findOne',  path: ':id' },
                { method: 'post',  key: 'save' },
            ]
        });
        
        const metaCtrl1 = CONTROLLER.get(meta.controllers[1]);
        assert.deepEqual(metaCtrl1, {
            path: 'Contract',
            endpoints: [
                { method: 'get',   key: 'findOne',  path: ':id' },
                { method: 'post',  key: 'save' },
            ]
        });
    });

    it('Check Main Route', () => {
        const meta = CONTROLLER_ROUTING.get(ApiRouting);
        assert.lengthOf(meta.controllers, 1);
        assert.lengthOf(meta.routes, 1);

        const metaCtrl = CONTROLLER.get(meta.controllers[0]);
        assert.deepEqual(metaCtrl, {
            path: 'User',
            endpoints: [
                { method: 'post',   key: 'login',   path: 'login' },
                { method: 'get',    key: 'findOne', path: ':id' },
                { method: 'post',   key: 'save' },
            ]
        });
    });
});