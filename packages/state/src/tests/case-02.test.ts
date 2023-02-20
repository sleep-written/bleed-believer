import type { Subscription } from 'rxjs';
import type { TestFn } from 'ava';
import type { Body } from './case-02.example.js';

import rawTest from 'ava';
import { BodyState } from './case-02.example.js';

const test = rawTest as TestFn<{
    queue: Body[];
    state: BodyState;
    subsc: Subscription;
}>;
test.before(t => {
    const state = new BodyState({ contr: {} });
    const queue: Body[] = [];
    const next = (v: Body) => {
        queue.push(v);
    };

    t.context = {
        queue,
        state,
        subsc: state
            .state
            .subscribe({ next })
    };
});
test.after(t => {
    t.context.subsc.unsubscribe();
});

test.serial('Add an user', async t => {
    await t.context.state.setUser({
        id: 66,
        nick: 'system',
        typeId: 1
    });
    t.pass();
});

test.serial('Add a product row', async t => {
    await t.context.state.addProductRow(0);
    t.pass();
});

test.serial('Add another product row', async t => {
    await t.context.state.addProductRow(1);
    t.pass();
});

test.serial('Modify a product row', async t => {
    await t.context.state.updateproductRow(1, {
        id: 55,
        quantity: 15000,
        price: 5.89
    });
    t.pass();
});

test.serial('Modify a product row (throws an error and the data doesn\'t change)', async t => {
    await t.throwsAsync(
        async () => {
            await t.context.state.updateproductRow(8, {
                id: 55,
                quantity: 15000,
                price: 5.89
            });
        },
        {
            message: 'Kill it!'
        }
    );
});

test.serial('Check queue', t => {
    t.deepEqual(t.context.queue, [
        {   // Initial state
            contr: {}
        },
        {   // Add an user
            user: {
                id: 66,
                nick: 'system',
                typeId: 1
            },
            contr: {}
        },
        {   // Add a product
            user: {
                id: 66,
                nick: 'system',
                typeId: 1
            },
            contr: {
                products: [
                    {
                        quantity: 0,
                        price: 0
                    }
                ]
            }
        },
        {   // Add another product
            user: {
                id: 66,
                nick: 'system',
                typeId: 1
            },
            contr: {
                products: [
                    {
                        quantity: 0,
                        price: 0
                    },
                    {
                        quantity: 0,
                        price: 0
                    }
                ]
            }
        },
        {   // Modify a product row
            user: {
                id: 66,
                nick: 'system',
                typeId: 1
            },
            contr: {
                products: [
                    {
                        quantity: 0,
                        price: 0
                    },
                    {
                        id: 55,
                        quantity: 15000,
                        price: 5.89
                    }
                ]
            }
        },
    ]);
});