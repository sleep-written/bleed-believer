import { ControllerRouting } from '../controller-routing/controller-routing';
import { flattenRoutes } from './flatten-routes';
import { Controller, ControllerPath } from '../controller';
import { Get, Post } from '../endpoint';
import { assert } from 'chai';

describe('Testing "@espresso/flatten-routes"', () => {
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

    @ControllerPath('*')
    class All extends Controller {
        @Get()
        throwError(): void {
            this.response.json('El endpoint no existe, no sea pendejo...');
        }
    }

    @ControllerPath('')
    class Root extends Controller {
        @Get()
        load(): void {}
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
        controllers:    [ User, All, Root ],
        routes:         [ DocumentsRouting ]
    })
    class ApiRouting {}

    describe('lowercase = false', () => {
        it('Validate nested API Routes', () => {
            const flat = flattenRoutes(DocumentsRouting);
            const data = flat.map(x => ({
                key: x.key,
                path: x.path,
                method: x.method,
            }));
    
            assert.sameDeepOrderedMembers(data, [
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
                }
            ]);
    
            const objs = flat.map(x => x.class);
            assert.strictEqual(objs[0], Quotation);
            assert.strictEqual(objs[1], Quotation);
            assert.strictEqual(objs[2], Contract);
            assert.strictEqual(objs[3], Contract);
        });
    
        it('Validate all API Routes', () => {
            const flat = flattenRoutes(ApiRouting);
            const data = flat.map(x => ({
                key: x.key,
                path: x.path,
                method: x.method,
            }));
    
            assert.sameDeepOrderedMembers(data, [
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
                    path: '/'
                },
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
                }
            ]);
    
            const objs = flat.map(x => x.class);
            assert.strictEqual(objs[0], User);
            assert.strictEqual(objs[1], User);
            assert.strictEqual(objs[2], User);
            assert.strictEqual(objs[3], All);
            assert.strictEqual(objs[4], Root);
            assert.strictEqual(objs[5], Quotation);
            assert.strictEqual(objs[6], Quotation);
            assert.strictEqual(objs[7], Contract);
            assert.strictEqual(objs[8], Contract);
        });
    });

    describe('lowercase = true', () => {
        it('Validate nested API Routes', () => {
            const flat = flattenRoutes(DocumentsRouting, true);
            const data = flat.map(x => ({
                key: x.key,
                path: x.path,
                method: x.method,
            }));
    
            assert.sameDeepOrderedMembers(data, [
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
                }
            ]);
    
            const objs = flat.map(x => x.class);
            assert.strictEqual(objs[0], Quotation);
            assert.strictEqual(objs[1], Quotation);
            assert.strictEqual(objs[2], Contract);
            assert.strictEqual(objs[3], Contract);
        });
    
        it('Validate all API Routes', () => {
            const flat = flattenRoutes(ApiRouting, true);
            const data = flat.map(x => ({
                key: x.key,
                path: x.path,
                method: x.method,
            }));
    
            assert.sameDeepOrderedMembers(data, [
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
                    path: '/'
                },
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
                }
            ]);
    
            const objs = flat.map(x => x.class);
            assert.strictEqual(objs[0], User);
            assert.strictEqual(objs[1], User);
            assert.strictEqual(objs[2], User);
            assert.strictEqual(objs[3], All);
            assert.strictEqual(objs[4], Root);
            assert.strictEqual(objs[5], Quotation);
            assert.strictEqual(objs[6], Quotation);
            assert.strictEqual(objs[7], Contract);
            assert.strictEqual(objs[8], Contract);
        });
    });
});