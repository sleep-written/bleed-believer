import { In, LessThan, Like, Raw, type FindOptionsWhere } from 'typeorm';
import { DBSync, EntitySync } from '@/index.js';

import { dataSourceSource } from './data-source.source.js';
import { dataSourceTarget } from './data-source.target.js';

import { ContractDetail } from './entities/contract-detail.entity.js';
import { UserType } from './entities/user-type.entity.js';
import { Contract } from './entities/contract.entity.js';
import { Product } from './entities/product.entity.js';
import { Server } from './entities/server.entity.js';
import { Client } from './entities/client.entity.js';
import { User } from './entities/user.entity.js';

// A where condition to select only a portion of the contracts
const userTypeWhere: FindOptionsWhere<UserType> = {
    id: In([ 1, 2 ])
};

const productWhere: FindOptionsWhere<Product>[] = [
    { description: Like('lamb%') },
    { description: Like('cheese%') },
];

const contractWhere: FindOptionsWhere<Contract> = {
    user: {
        userType: userTypeWhere
    },
    date: Raw(c =>
            `CAST(strftime('%Y', ${c}) AS INT) >= `
        +   `CAST(strftime('%Y', :currentYear) AS INT)`,
        { currentYear: 2024 }
    ),
    contractDetails: {
        product: productWhere
    }
};

// Create the instance of `DBSync`
const dbSync = new DBSync(
    [
        // `UserType` hasn't FKs
        new EntitySync(UserType, {
            chunkSize: 100,
            where: userTypeWhere
        }),

        // `User` entity only has a FK with `UserType`
        new EntitySync(User, {
            chunkSize: 100,
            where: {
                userType: userTypeWhere,
                contracts: contractWhere
            },
            relationsToCheck: {
                userType: true
            }
        }),

        // `Client` hasn't FKs
        new EntitySync(Client, {
            chunkSize: 100,
            where: {
                // Only clients who has contracts
                contracts: contractWhere
            }
        }),

        // `Contract` depends of `User` and `Client`
        new EntitySync(Contract, {
            chunkSize: 100,
            // Only a portion of contracts
            where: contractWhere,
            relationsToCheck: {
                user: true,
                client: true,
                contractDetails: true
            }
        }),

        // `Product` only have recursive FKs
        new EntitySync(Product, {
            chunkSize: 50
        }),

        // `ContractDetail` depends
        new EntitySync(ContractDetail, {
            chunkSize: 100,
            where: {
                contract: contractWhere,
                product: productWhere
            }
        }),

        new EntitySync(Server, {
            chunkSize: 100,
            where: {
                port: LessThan(1000)
            }
        })
    ],
    {
        verbose: true
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