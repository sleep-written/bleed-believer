import { readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import test from 'ava';

import { dataSourceTarget } from '@example/data-source.target.js';
import { UserType } from '@example/entities/user-type.entity.js';
import { User } from '@example/entities/user.entity.js';

import { EntityStorage } from './entity-storage.js';
import { EntityMapper } from '@/entity-mapper/index.js';

let files: {
    userType: EntityStorage<UserType>;
    user: EntityStorage<User>;
};

test.before(async _ => {
    await dataSourceTarget.initialize();
    files = {
        userType: new EntityStorage(
            new EntityMapper(dataSourceTarget.manager, UserType),
            join(tmpdir(), `db-sync.entity-mapper.${UserType.name}.test.ts`)
        ),
        user: new EntityStorage(
            new EntityMapper(dataSourceTarget.manager, User),
            join(tmpdir(), `db-sync.entity-mapper.${User.name}.test.ts`)
        )
    };
    
    await Promise.all(Object
        .values(files)
        .map(x => x.delete())
    );
});

test.after(async _ => {
    await dataSourceTarget.destroy();
    await Promise.all(Object
        .values(files)
        .map(x => x.delete())
    );
});

test.serial('Read `UserType` DB content and store in DB', async t => {
    const data = await UserType.find();
    await files.userType.write(data);
    t.pass();
});

test.serial('Read `UserType` stored in file', async t => {
    const data: UserType[] = [];
    await files.userType.read(100, items => {
        data.push(...items);
    });

    t.deepEqual(
        JSON.parse(JSON.stringify(data)),
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

test.serial('Read `User` DB content and store in DB', async t => {
    const data = await User.find({ relations: { userType: true } });
    await files.user.write(data);
    t.pass();
});

test.serial('Read `User` stored in file', async t => {
    const data: User[] = [];
    await files.user.read(100, items => {
        data.push(...items);
    });

    t.deepEqual(
        JSON.parse(JSON.stringify(data)),
        [
            {
                id: 1,
                dni: "1-9",
                name: "Brian Carroll",
                userType: { id: 1 }
            },
            {
                id: 2,
                dni: "11.111.111-1",
                name: "MD. Dragynfly",
                userType: { id: 2 }
            },
        ]
    );
});
