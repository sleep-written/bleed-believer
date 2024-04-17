import type { EntityManager } from 'typeorm';
import type { Seeder } from './seeder.js';

import { UserTypeSeeder } from './target/user-type.seeder.js';
import { UserSeeder } from './target/user.seeder.js';

export const targetSeeders: { new(m: EntityManager): Seeder }[] = [
    UserTypeSeeder,
    UserSeeder
];
