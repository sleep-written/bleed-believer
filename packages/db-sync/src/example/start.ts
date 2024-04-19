import { Raw, type FindOptionsWhere } from 'typeorm';
import { DBSync, EntitySync } from '@/index.js';

import { dataSourceSource } from './data-source.source.js';
import { dataSourceTarget } from './data-source.target.js';

import { UserType } from './entities/user-type.entity.js';
import { Contract } from './entities/contract.entity.js';
import { Client } from './entities/client.entity.js';
import { User } from './entities/user.entity.js';

// A where condition to select only a part of the contracts
const contractWhere: FindOptionsWhere<Contract> = {
    date: Raw(c =>
            `CAST(strftime('%Y', ${c}) AS INT) >= `
        +   `CAST(strftime('%Y', DATE('now')) AS INT)`
    )
};

// Create the instance of `DBSync`
const dbSync = new DBSync(
    [
        new EntitySync(UserType, {
            chunkSize: 100
        }),
        new EntitySync(User, {
            chunkSize: 100,
            where: {
                contracts: contractWhere
            },
            relationsToCheck: {
                userType: true
            }
        }),
        new EntitySync(Client, {
            chunkSize: 100,
            where: {
                // Only clients who has contracts
                contracts: contractWhere
            }
        }),
        new EntitySync(Contract, {
            chunkSize: 100,
            // Only a portion of contracts
            where: contractWhere,
            relationsToCheck: {
                user: true,
                client: true
            }
        })
    ], {
        // Custom log function
        verbose(...a): void {
            console.log('[db-sync] ->', ...a);
        }
    }
);

// Open the connection of both DBs
await Promise.all([
    dataSourceSource.initialize(),
    dataSourceTarget.initialize(),
]);

// Clean the data of target DB, and send the
// selected data from source DB to target DB
await dbSync.execute(
    dataSourceSource,
    dataSourceTarget
);

// Close the connection of both DBs
await Promise.all([
    dataSourceSource.destroy(),
    dataSourceTarget.destroy(),
]);