import type { FindOptionsWhere, ObjectLiteral } from 'typeorm';

/**
 * Defines the configuration options for synchronizing a specific entity type.
 */
export interface EntitySyncOptions<E extends ObjectLiteral> {
    /**
     * Specifies the number of entities to process per batch. This helps in managing memory and performance during the sync process.
     */
    chunkSize: number;

    /**
     * Optional condition to filter the entities that will be synchronized. Uses TypeORM's `FindOptionsWhere` for defining complex queries.
     */
    where?: FindOptionsWhere<E>;

    /**
     * Optionally specify which relations of the entity need to be checked to ensure data integrity.
     */
    relationsToCheck?: Partial<Record<keyof E, boolean>>;
}
