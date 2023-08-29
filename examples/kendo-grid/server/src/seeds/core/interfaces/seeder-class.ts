import type { EntityManager } from 'typeorm';
import type { Seeder } from '../seeder.js';

export interface SeederClass {
    name: string;
    new(manager: EntityManager): Seeder;
}