import type { EntitySyncOptions } from './entity-sync.options.js';
import type { EntityManager, ObjectLiteral } from 'typeorm';
import type { EntityClass, RelationMetadata } from '../entity-mapper/index.js';

import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

import { EntityMapper } from '../entity-mapper/index.js';
import { EntityStorage } from '../entity-storage/entity-storage.js';

/**
 * Manages the synchronization process for a single entity type, including data extraction, transformation, and loading.
 */
export class EntitySync<E extends ObjectLiteral> {
    /**
     * The entity class that this synchronizer handles.
     */
    #entity: EntityClass<E>;

    /**
     * The options defining the synchronization behavior for this entity.
     */
    #options: EntitySyncOptions<E>;

    /**
     * Storage handler for managing the entity's data file.
     */
    #storage: EntityStorage;

    /**
     * Gets the name of the entity being synchronized.
     */
    get entityName(): string {
        return this.#entity.name;
    }

    /**
     * Constructs a new instance of `EntitySync`.
     * 
     * @param entity The entity class to be synchronized.
     * @param options The options to customize the synchronization process.
     */
    constructor(
        entity: EntityClass<E>,
        options: EntitySyncOptions<E>
    ) {
        this.#entity = entity;
        this.#options = options;

        const uuid = randomUUID();
        const path = join(tmpdir(), 'db-sync', `${entity.name}.${uuid}.666`);
        this.#storage = new EntityStorage(path);
    }

    /**
     * Creates a temporary file for the entity's data, retrieved based on the synchronization options.
     * 
     * @param manager The TypeORM EntityManager to handle database operations.
     */
    async createFile(manager: EntityManager): Promise<void> {
        const entityMapper = new EntityMapper(manager, this.#entity);
        await this.#storage.createFolder();
        await this.#storage.kill();

        // Get data from DB and save into file
        let skip = 0;
        const { where, chunkSize, relationsToCheck } = this.#options;
        while (true) {
            // Get a chunk of entities
            const chunk = await entityMapper
                .getQuery(where)
                .distinct()
                .limit(chunkSize)
                .offset(skip)
                .getMany();

            if (chunk.length > 0) {
                skip += chunk.length;

                // Remove entities without required relations
                if (relationsToCheck) {
                    Object
                        .entries(relationsToCheck)
                        .filter(([ _, v ]) => typeof v === 'boolean' && v)
                        .map(([ k ]) => {
                            // Get metadata
                            return entityMapper
                                .getRelationMetadata(k) as RelationMetadata;
                        })
                        .filter(m => m != null)
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

        if (!await this.#storage.exists()) {
            await this.#storage.touch();
        }
    }

    /**
     * Inserts data into the target database from a temporary file.
     * 
     * @param manager The TypeORM EntityManager to handle database operations.
     */
    async insertIntoDB(manager: EntityManager): Promise<void> {
        const entityMapper = new EntityMapper(manager, this.#entity);
        const recursiveRelations = entityMapper.filterRelationMetadata(x => x.recursive);

        await this.#storage.read(this.#options.chunkSize, async lines => {
            let items = lines
                .filter(x => x.length > 0)
                .map(x => entityMapper.parse(x));

            if (recursiveRelations.length > 0) {
                items = items.map(x => {
                    recursiveRelations.forEach(({ propertyName }) => {
                        delete x[propertyName];
                    });

                    return x;
                });
            }

            await manager.save(items);
        });

        if (recursiveRelations.length > 0) {
            await this.#storage.read(this.#options.chunkSize, async lines => {
                const items = lines
                    .map(x => entityMapper.parse(x))
                    .map(x => {
                        const y = new entityMapper.entity();
                        y[entityMapper.pkKey] = x[entityMapper.pkKey];
                        recursiveRelations.forEach(({ propertyName, relatedEntity, relatedPK }) => {
                            if (x[propertyName]?.[relatedPK] != null) {
                                const r = new relatedEntity();
                                r[relatedPK] = x[propertyName][relatedPK];
                                (y as any)[propertyName] = r;
                            }
                        });

                        return y;
                    });

                await manager.save(items);
            });
        }
    }

    /**
     * Clears the data from the target database for this entity.
     * 
     * @param manager The TypeORM EntityManager to handle the deletion.
     */
    async clearDataFromDB(manager: EntityManager): Promise<void> {
        manager.delete(this.#entity, {});
    }

    /**
     * Deletes the temporary file used during the synchronization process.
     */
    async clearFile(): Promise<void> {
        return this.#storage.kill();
    }
}
