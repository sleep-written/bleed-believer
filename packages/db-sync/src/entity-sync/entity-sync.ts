import type { EntityClass } from '../entity-mapper/index.js';
import type { EntitySyncOptions } from './entity-sync.options.js';
import type { EntityManager, ObjectLiteral } from 'typeorm';

import { join } from 'path';
import { tmpdir } from 'os';

import { EntityMapper } from '../entity-mapper/index.js';
import { EntityStorage } from '../entity-storage/entity-storage.js';

export class EntitySync<E extends ObjectLiteral> {
    #entity: EntityClass<E>;
    #options: EntitySyncOptions<E>;
    #storage: EntityStorage;

    constructor(
        entity: EntityClass<E>,
        options: EntitySyncOptions<E>
    ) {
        this.#entity = entity;
        this.#options = options;

        const path = join(tmpdir(), 'db-sync', `${entity.name}.666`);
        this.#storage = new EntityStorage(path)
    }

    async createFile(manager: EntityManager): Promise<void> {
        const entityMapper = new EntityMapper(manager, this.#entity);
        await this.#storage.createFolder();
        await this.#storage.kill();

        // Get data from DB and save into file
        let skip = 0;
        const { where, chunkSize, relationsToCheck } = this.#options;
        while (true) {
            // Get a chunk of entities
            const chunk = await manager.find(
                entityMapper.entity, {
                    relations: entityMapper.relations,
                    select: entityMapper.select,
                    take: chunkSize,
                    where,
                    skip
                }
            );

            if (chunk.length > 0) {
                skip += chunk.length;

                // Remove entities without required relations
                if (relationsToCheck) {
                    Object
                        .entries(relationsToCheck)
                        .filter(([ _, v ]) => typeof v === 'boolean' && v)
                        .map(([ k ]) => {
                            // Get metadata
                            const m = entityMapper.getRelationMetadata(k);
                            if (!m) {
                                throw new Error(`Metadata of FK "${k}" not found.`);
                            } else {
                                return m;
                            }
                        })
                        .forEach(({ propertyName, relatedPK }) => {
                            // Check FK
                            const i = chunk.findIndex(x => (
                                x[propertyName] == null ||
                                x[propertyName]?.[relatedPK] == null
                            ));
                            if (i >= 0) {
                                chunk.splice(i, 1);
                            }
                        });
                }

                // Insert chunk into file
                if (chunk.length > 0) {
                    const lines = chunk.map(x => entityMapper.stringify(x));
                    await this.#storage.write(lines);
                }
            } else {
                break;
            }
        }
    }

    async insertIntoDB(manager: EntityManager): Promise<void> {
        const entityMapper = new EntityMapper(manager, this.#entity);
        await this.#storage.read(this.#options.chunkSize, async lines => {
            const items = lines.map(x => entityMapper.parse(x));
            await manager.save(items);
        });
    }

    async clearDataFromDB(manager: EntityManager): Promise<void> {
        manager.delete(this.#entity, {});
    }

    async clearFile(): Promise<void> {
        return this.#storage.kill();
    }
}
