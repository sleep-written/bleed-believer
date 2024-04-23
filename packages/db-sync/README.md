
# @bleed-believer/db-sync

Migrate data from a source database to a target database using models defined with TypeORM. This module, implemented in ESM, facilitates database synchronization by:
-   Deleting existing data in the target database.
-   Dumping data from the source database (resolving foreign keys) into temporary files.
-   Reading data from the temporary files one at a time to manage memory efficiently.
-   Inserting the read data into the target database.
-   Deleting the temporary files.

## Installation
-   First install TypeORM:
    ```shell
    npm i --save typeorm
    ```
    
-   Then install this library:
    ```shell
    npm i --save @bleed-believer/db-sync
    ```

## Example Scenario
Suppose you have a production database (hereafter referred to as the source DB) with numerous tables and fields, and you want to create a test database (hereafter referred to as the target DB) containing only a portion of the production data.

### Entities
First, declare the entities with the fields of interest from the source DB.

#### UserType
```ts
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'UserType' })
export class UserType extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar' })
    cod!: string;

    @Column({ type: 'nvarchar' })
    description!: string;

    @OneToMany(_ => User, r => r.userType)
    users?: Relation<User[]> | null;
}
```

#### User
```ts
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation, OneToMany } from 'typeorm';
import { UserType } from './user-type.entity.js';
import { Contract } from './contract.entity.js';

@Entity({ name: 'User' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar' })
    dni!: string;

    @Column({ type: 'nvarchar' })
    name!: string;

    @ManyToOne(_ => UserType, r => r.users)
    userType?: Relation<UserType> | null;

    @OneToMany(_ => Contract, r => r.user)
    contracts?: Relation<Contract[]> | null;
}
```

#### Client
```ts
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Contract } from './contract.entity.js';

@Entity({ name: 'Client' })
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'nvarchar' })
    name!: string;

    @Column({ type: 'nvarchar' })
    address!: string;

    @OneToMany(_ => Contract, r => r.client)
    contracts?: Relation<Contract[]> | null;
}
```

#### Product
```ts
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { ContractDetail } from './contract-detail.entity.js';

@Entity({ name: 'Product' })
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'varchar' })
    cod!: string;

    @Column({ type: 'nvarchar' })
    description!: string;

    @ManyToOne(_ => Product, r => r.id, { nullable: true })
    parent?: Relation<Product> | null;

    @OneToMany(_ => ContractDetail, r => r.product)
    contractDetails?: Relation<ContractDetail[]> | null;
}
```

#### Contract
```ts
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { ContractDetail } from './contract-detail.entity.js';
import { Client } from './client.entity.js';
import { User } from './user.entity.js';

@Entity({ name: 'Contract' })
export class Contract extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'int' })
    corr!: number;

    @Column({ type: 'datetime' })
    date!: Date;

    @ManyToOne(_ => Client, r => r.contracts)
    client?: Relation<Client> | null;

    @ManyToOne(_ => User, r => r.contracts)
    user?: Relation<User> | null;

    @OneToMany(_ => ContractDetail, r => r.contract)
    contractDetails?: Relation<ContractDetail[]> | null;
}
```

### ContractDetail
```ts
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Contract } from './contract.entity.js';
import { Product } from './product.entity.js';

@Entity({ name: 'ContractDetail' })
export class ContractDetail extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    quantity!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price!: number;

    @ManyToOne(_ => Product, r => r.contractDetails)
    product?: Relation<Product> | null;

    @ManyToOne(_ => Contract, r => r.contractDetails)
    contract?: Relation<Contract> | null;
}
```

## Usage
Usage is demonstrated based on the provided example scenario.

```ts
// Import necessary components and entities
import { Raw, type FindOptionsWhere } from 'typeorm';
import { DBSync, EntitySync } from '@bleed-believer/db-sync.js';

import { dataSourceSource } from './data-source.source.js';
import { dataSourceTarget } from './data-source.target.js';

import { ContractDetail } from './entities/contract-detail.entity.js';
import { UserType } from './entities/user-type.entity.js';
import { Contract } from './entities/contract.entity.js';
import { Product } from './entities/product.entity.js';
import { Client } from './entities/client.entity.js';
import { User } from './entities/user.entity.js';

// A where condition to select only a portion of the contracts
const contractWhere: FindOptionsWhere<Contract> = {
    date: Raw(c =>
            `CAST(strftime('%Y', ${c}) AS INT) >= `
        +   `CAST(strftime('%Y', DATE('now')) AS INT)`
    )
};

// Create the instance of `DBSync`
const dbSync = new DBSync(
    [
        // `UserType` hasn't FKs
        new EntitySync(UserType, {
            chunkSize: 100
        }),

        // `User` entity only has a FK with `UserType`
        new EntitySync(User, {
            chunkSize: 100,
            where: {
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
                client: true
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
                contract: contractWhere
            }
        })
    ]
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
```

## Considerations
### `EntitySync` order
The order of entities declared when instantiating EntitySync is crucial. Begin with entities that do not have foreign keys linking to other entities, adding entities as their dependencies are declared.

### Verbose mode
Enable verbose mode by setting it to true or by providing a custom function to customize behavior:
```ts
const dbSync = new DBSync([ ... ], {
    verbose: true
});

// Or with a custom function
const dbSync = new DBSync([ ... ], {
    verbose: msg => {
        console.log('event:', msg);
    }
});
```