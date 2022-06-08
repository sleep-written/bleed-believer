import test from 'ava';

import { CONTROLLER_ROUTING } from './controller-routing.js';
import { CONTROLLER } from '../controller/controller.js';
import * as case01 from './case-01.example.js';

test('Check Nested Route', t => {
    const meta = CONTROLLER_ROUTING.get(case01.DocumentsRouting);
    
    t.deepEqual(
        Object.keys(meta),
        [ 'controllers', 'routes', 'path' ]
    );

    t.is(meta.controllers.length, 2);
    t.is(meta.routes.length, 0);
    t.is(meta.path, '/Documents');

    const metaCtrl0 = CONTROLLER.get(meta.controllers[0]);
    t.deepEqual(metaCtrl0, {
        endpoints: [
            { method: 'get',   key: 'findOne',  path: '/:id' },
            { method: 'post',  key: 'save' },
        ]
    });
    
    const metaCtrl1 = CONTROLLER.get(meta.controllers[1]);
    t.deepEqual(metaCtrl1, {
        endpoints: [
            { method: 'get',   key: 'findOne',  path: '/:id' },
            { method: 'post',  key: 'save' },
        ]
    });
});

test('Check Main Route', t => {
    const meta = CONTROLLER_ROUTING.get(case01.ApiRouting);
    t.is(meta.controllers.length, 1);
    t.is(meta.routes.length, 1);

    const metaCtrl = CONTROLLER.get(meta.controllers[0]);
    t.deepEqual(metaCtrl, {
        endpoints: [
            { method: 'post',   key: 'login',   path: '/login' },
            { method: 'get',    key: 'findOne', path: '/:id' },
            { method: 'post',   key: 'save' },
        ]
    });
});