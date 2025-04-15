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
            '{"id":1,"cod":"SYSTEM","description":"The owner of this implementation"}',
            '{"id":2,"cod":"ADMIN","description":"Administrator of this instance"}'
        ]
    );
});

test('Parse `UserType`', async t => {
    const mapper = new EntityMapper(dataSourceTarget.manager, UserType);
    const items = [
            '{"id":1,"cod":"SYSTEM","description":"The owner of this implementation"}',
            '{"id":2,"cod":"ADMIN","description":"Administrator of this instance"}'
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
                cod: "SYSTEM",
                description: "The owner of this implementation"
            },
            {
                id: 2,
                cod: "ADMIN",
                description: "Administrator of this instance"
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

    t.deepEqual(lines, [
        '{"id":8,"dni":"42-7412647","name":"aongin7","userType":{"id":2}}',
        '{"id":113,"dni":"72-5741016","name":"mtrittam34","userType":{"id":2}}',
        '{"id":227,"dni":"90-7871541","name":"kkleinlerer6a","userType":{"id":2}}',
        '{"id":254,"dni":"72-3706346","name":"gkingsworth71","userType":{"id":2}}',
        '{"id":352,"dni":"75-6031284","name":"jgippes9r","userType":{"id":2}}',
        '{"id":582,"dni":"80-8966782","name":"cwhathamg5","userType":{"id":2}}',
        '{"id":690,"dni":"63-3395395","name":"speterffyj5","userType":{"id":2}}',
        '{"id":714,"dni":"72-3862052","name":"rattridejt","userType":{"id":2}}',
        '{"id":741,"dni":"29-6390108","name":"twederellkk","userType":{"id":2}}',
        '{"id":773,"dni":"10-8407299","name":"pbothielg","userType":{"id":2}}',
        '{"id":783,"dni":"32-7152273","name":"ngianellilq","userType":{"id":2}}',
        '{"id":790,"dni":"37-5601577","name":"jgiaomozzolx","userType":{"id":2}}',
        '{"id":795,"dni":"08-1864539","name":"ajerromm2","userType":{"id":2}}',
        '{"id":847,"dni":"79-4502545","name":"cbattlesonni","userType":{"id":2}}',
        '{"id":959,"dni":"42-4808446","name":"vwibrowqm","userType":{"id":2}}',
        '{"id":995,"dni":"46-6227552","name":"fchaytorrm","userType":{"id":2}}'
    ]);
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