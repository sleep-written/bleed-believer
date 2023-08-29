import type { EntityManager } from 'typeorm';

export abstract class Seeder {
    #manager: EntityManager;
    protected get manager(): EntityManager {
        return this.#manager;
    }

    constructor(manager: EntityManager) {
        this.#manager = manager;
    }

    abstract execute(): Promise<void>;
}