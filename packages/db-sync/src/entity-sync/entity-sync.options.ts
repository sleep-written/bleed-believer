import type { FindOptionsWhere, ObjectLiteral } from 'typeorm';

export interface EntitySyncOptions<E extends ObjectLiteral> {
    chunkSize: number;
    where?: FindOptionsWhere<E>;
    relationsToCheck?: Partial<Record<keyof E, boolean>>;
}
