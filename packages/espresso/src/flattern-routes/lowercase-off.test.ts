import test from 'ava';

import { flattenRoutes } from './flatten-routes.js';
import * as case01 from './case-01.example.js';

test('Validate nested API Routes', t => {
    const flat = flattenRoutes(case01.DocumentsRouting);
    const data = flat.map(x => ({
        key: x.key,
        path: x.path,
        method: x.method,
    }));

    t.deepEqual(data, [
        {
            key: 'findOne',
            method: 'get',
            path: '/Documents/Quotation/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/Documents/Quotation'
        },
        {
            key: 'findOne',
            method: 'get',
            path: '/Documents/Contract/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/Documents/Contract'
        },
        {
            key: 'load',
            method: 'get',
            path: '/Documents/*'
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
    const flat = flattenRoutes(case01.ApiRouting);
    const data = flat.map(x => ({
        key: x.key,
        path: x.path,
        method: x.method,
    }));

    t.deepEqual(data, [
        {
            key: 'findOne',
            method: 'get',
            path: '/Documents/Quotation/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/Documents/Quotation'
        },
        {
            key: 'findOne',
            method: 'get',
            path: '/Documents/Contract/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/Documents/Contract'
        },
        {
            key: 'load',
            method: 'get',
            path: '/Documents/*'
        },
        {
            key: 'login',
            method: 'post',
            path: '/User/login',
        },
        {
            key: 'findOne',
            method: 'get',
            path: '/User/:id',
        },
        {
            key: 'save',
            method: 'post',
            path: '/User'
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
    t.deepEqual(objs[0], case01.Quotation);
    t.deepEqual(objs[1], case01.Quotation);
    t.deepEqual(objs[2], case01.Contract);
    t.deepEqual(objs[3], case01.Contract);
    t.deepEqual(objs[4], case01.Root);
    t.deepEqual(objs[5], case01.User);
    t.deepEqual(objs[6], case01.User);
    t.deepEqual(objs[7], case01.User);
    t.deepEqual(objs[8], case01.All);
    t.deepEqual(objs[9], case01.Root);
});