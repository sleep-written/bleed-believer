import type { BaseEntity, ObjectLiteral } from 'typeorm';

export type EntityData<T extends ObjectLiteral> = Omit<
    Partial<T>,
    keyof BaseEntity
>;
