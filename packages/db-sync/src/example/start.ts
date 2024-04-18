import { dataSourceSource } from './data-source.source.js';
import { dataSourceTarget } from './data-source.target.js';

import { EntitySync } from '../entity-sync/index.js';
import { UserType } from './entities/user-type.entity.js';
import { User } from './entities/user.entity.js';

const entitySyncs = [
    new EntitySync(UserType, {
        chunkSize: 100
    }),
    new EntitySync(User, {
        chunkSize: 100,
        relationsToCheck: {
            userType: true
        }
    })
];

await Promise.all([
    dataSourceSource.initialize(),
    dataSourceTarget.initialize(),
]);

const sourceManager = dataSourceSource.manager;
await dataSourceTarget.transaction(async targetManager => {
    for (const entitySync of entitySyncs.slice().reverse()) {
        await entitySync.createFile(sourceManager);
        await entitySync.clearDataFromDB(targetManager);
    }

    for (const entitySync of entitySyncs) {
        await entitySync.insertIntoDB(targetManager);
    }
});

await Promise.all([
    dataSourceSource.destroy(),
    dataSourceTarget.destroy(),
]);