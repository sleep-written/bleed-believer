import test from 'ava';

import { dataSourceTarget } from '@example/data-source.target.js';
import { UserType } from '@example/entities/user-type.entity.js';
import { User } from '@example/entities/user.entity.js';

import { EntityMapper } from './entity-mapper.js';

test.before(async _ => {
    await dataSourceTarget.initialize();
});

test.after(async _ => {
    await dataSourceTarget.destroy();
});

test('Check `UserType` metadata', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, UserType);
    t.deepEqual(mapper.select, {
        id: true,
        cod: true,
        description: true
    });

    t.is(mapper.relationsMetadata.length, 0);
});

test('Stringify `UserType`', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, UserType);
    const items = await UserType.find();
    const lines = items.map(x => mapper.stringify(x));

    t.deepEqual(
        lines,
        [
            '{"id":1,"cod":"ADMIN","description":"Administrator of the system"}',
            '{"id":2,"cod":"GUEST","description":"Guest user"}'
        ]
    );
});

test('Parse `UserType`', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, UserType);
    const items = [
            '{"id":1,"cod":"ADMIN","description":"Administrator of the system"}',
            '{"id":2,"cod":"GUEST","description":"Guest user"}'
        ]
        .map(x => mapper.parse(x));

    for (const item of items) {
        t.true(item instanceof UserType);
    }

    const plainItems = JSON.parse(JSON.stringify(items));
    t.deepEqual(
        plainItems,
        [
            {
                id: 1,
                cod: 'ADMIN',
                description: 'Administrator of the system'
            },
            {
                id: 2,
                cod: 'GUEST',
                description: 'Guest user'
            }
        ]
    );
});

test('Check `User` metadata', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, User);
    t.deepEqual(mapper.select, {
        id: true,
        dni: true,
        name: true,
        userType: {
            id: true
        },
    });

    t.deepEqual(mapper.relationsMetadata, [
        {
            propertyName: 'userType',
            recursive: false,
            relatedEntity: UserType,
            relatedPK: 'id'
        }
    ]);
});

test('Stringify `User`', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, User);
    const items = await User.find({ relations: { userType: true } });
    const lines = items.map(x => mapper.stringify(x));

    t.deepEqual(
        lines,
        [
            '{"id":1,"dni":"1-9","name":"Brian Carroll","userType":{"id":1}}',
            '{"id":2,"dni":"11.111.111-1","name":"MD. Dragynfly","userType":{"id":2}}'
        ]
    );
});

test('Parse `User`', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, User);
    const items = [
            '{"id":1,"dni":"1-9","name":"Brian Carroll","userType":{"id":1}}',
            '{"id":2,"dni":"11.111.111-1","name":"MD. Dragynfly","userType":{"id":2}}'
        ]
        .map(x => mapper.parse(x));

    for (const item of items) {
        t.true(item instanceof User);
        t.true(item.userType instanceof UserType);
    }

    const plainItems = JSON.parse(JSON.stringify(items));
    t.deepEqual(
        plainItems,
        [
            {
                id: 1,
                dni: '1-9',
                name: 'Brian Carroll',
                userType: { id: 1 }
            },
            {
                id: 2,
                dni: '11.111.111-1',
                name: 'MD. Dragynfly',
                userType: { id: 2 }
            }
        ]
    );
});