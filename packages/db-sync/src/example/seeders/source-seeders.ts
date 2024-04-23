import type { EntityManager } from 'typeorm';
import type { Seeder } from './seeder.js';

import { UserTypeSeeder } from './source/user-type.seeder.js';
import { UserSeeder } from './source/user.seeder.js';
import { ClientSeeder } from './source/client.seeder.js';
import { ContractSeeder } from './source/contract.seeder.js';
import { ProductSeeder } from './source/product.seeder.js';
import { ContractDetailSeeder } from './source/contract-detail.seeder.js';

export const sourceSeeders: { new(m: EntityManager): Seeder }[] = [
    UserTypeSeeder,
    UserSeeder,
    ClientSeeder,
    ContractSeeder,
    ProductSeeder,
    ContractDetailSeeder,
];
