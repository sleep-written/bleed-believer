import { dataSourceSource } from './data-source.source.js';
import { dataSourceTarget } from './data-source.target.js';

import { DBSync } from '@/db-sync.js';

import { EntitySync } from '../entity-sync/index.js';
import { UserType } from './entities/user-type.entity.js';
import { Contract } from './entities/contract.entity.js';
import { Client } from './entities/client.entity.js';
import { User } from './entities/user.entity.js';

const dbSync = new DBSync([
    new EntitySync(UserType, {
        chunkSize: 100
    }),
    new EntitySync(User, {
        chunkSize: 100,
        relationsToCheck: {
            userType: true
        }
    }),
    new EntitySync(Client, {
        chunkSize: 100
    }),
    new EntitySync(Contract, {
        chunkSize: 100,
        relationsToCheck: {
            user: true,
            client: true
        }
    })
]);

await Promise.all([
    dataSourceSource.initialize(),
    dataSourceTarget.initialize(),
]);

await dbSync.execute(
    dataSourceSource,
    dataSourceTarget
);

await Promise.all([
    dataSourceSource.destroy(),
    dataSourceTarget.destroy(),
]);