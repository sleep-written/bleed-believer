import type { EntityManager } from 'typeorm';
import type { Seeder } from './seeder.js';

import { UserTypeSeeder } from './source/user-type.seeder.js';
import { UserSeeder } from './source/user.seeder.js';

export const sourceSeeders: { new(m: EntityManager): Seeder }[] = [
    UserTypeSeeder,
    UserSeeder
];
