import { tmpdir } from 'os';
import { join } from 'path';
import test from 'ava';

import { EntityStorage } from './entity-storage.js';

let files: {
    userType: EntityStorage;
    user: EntityStorage;
};

test.before(async _ => {
    files = {
        userType: new EntityStorage(
            join(tmpdir(), `db-sync.entity.${'UserType'}.test.ts`)
        ),
        user: new EntityStorage(
            join(tmpdir(), `db-sync.entity.${'User'}.test.ts`)
        )
    };
    
    await Promise.all(Object
        .values(files)
        .map(x => x.kill())
    );
});

test.after(async _ => {
    await Promise.all(Object
        .values(files)
        .map(x => x.kill())
    );
});

test.serial('Write text lines and verify file operation', async t => {
    const lines = [
        "ADMIN,Administrator of the system",
        "GUEST,Guest user"
    ];
    await files.userType.write(lines);
    t.pass();
});

test.serial('Read text lines from file', async t => {
    const expectedLines = [
        "ADMIN,Administrator of the system",
        "GUEST,Guest user"
    ];
    const readLines: string[] = [];
    await files.userType.read(100, lines => {
        readLines.push(...lines);
    });

    t.deepEqual(readLines, expectedLines);
});

test.serial('Handle more complex line structures', async t => {
    const lines = [
        "1,1-9,Brian Carroll,ADMIN",
        "2,11.111.111-1,MD. Dragynfly,GUEST"
    ];
    await files.user.write(lines);
    t.pass();
});

test.serial('Read complex structured lines from file', async t => {
    const expectedLines = [
        "1,1-9,Brian Carroll,ADMIN",
        "2,11.111.111-1,MD. Dragynfly,GUEST"
    ];
    const readLines: string[] = [];
    await files.user.read(100, lines => {
        readLines.push(...lines);
    });

    t.deepEqual(readLines, expectedLines);
});
