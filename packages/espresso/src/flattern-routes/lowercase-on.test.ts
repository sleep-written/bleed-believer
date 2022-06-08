import test from 'ava';

import { flattenRoutes } from './flatten-routes.js';
import * as case01 from './case-01.example.js';

test('Validate nested API Routes', t => {
    const flat = flattenRoutes(case01.DocumentsRouting, true);
    const data = flat.map(x => ({
        key: x.key,
        path: x.path,
        method: x.method,
    }));

    t.deepEqual(data, [
        {
            key: 'findOne',
            method: 'get',
            path: '/documents/quotation/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/documents/quotation'
        },
        {
            key: 'findOne',
            method: 'get',
            path: '/documents/contract/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/documents/contract'
        },
        {
            key: 'load',
            method: 'get',
            path: '/documents/*'
        }
    ]);

    const objs = flat.map(x => x.class);
    t.deepEqual(objs[0], case01.Quotation);
    t.deepEqual(objs[1], case01.Quotation);
    t.deepEqual(objs[2], case01.Contract);
    t.deepEqual(objs[3], case01.Contract);
    t.deepEqual(objs[4], case01.Root);
});

test('Validate all API Routes', t => {
    const flat = flattenRoutes(case01.ApiRouting, true);
    const data = flat.map(x => ({
        key: x.key,
        path: x.path,
        method: x.method,
    }));

    t.deepEqual(data, [
        {
            key: 'findOne',
            method: 'get',
            path: '/documents/quotation/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/documents/quotation'
        },
        {
            key: 'findOne',
            method: 'get',
            path: '/documents/contract/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/documents/contract'
        },
        {
            key: 'load',
            method: 'get',
            path: '/documents/*'
        },
        {
            key: 'login',
            method: 'post',
            path: '/user/login',
        },
        {
            key: 'findOne',
            method: 'get',
            path: '/user/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/user'
        },
        {
            key: 'throwError',
            method: 'get',
            path: '/*'
        },
        {
            key: 'load',
            method: 'get',
            path: '/*'
        }
    ]);

    const objs = flat.map(x => x.class);
   t.is(objs[0], case01.Quotation);
   t.is(objs[1], case01.Quotation);
   t.is(objs[2], case01.Contract);
   t.is(objs[3], case01.Contract);
   t.is(objs[4], case01.Root);
   t.is(objs[5], case01.User);
   t.is(objs[6], case01.User);
   t.is(objs[7], case01.User);
   t.is(objs[8], case01.All);
   t.is(objs[9], case01.Root);
});