import type { Seeder } from 'seeds/core/seeder.js';
import type { EntityManager } from 'typeorm';

import { UserSeeder } from './user.seeder.js';
import { PostSeeder } from './post.seeder.js';

export const seeders: ({ new(manager: EntityManager): Seeder })[] = [
    UserSeeder,
    PostSeeder,
];