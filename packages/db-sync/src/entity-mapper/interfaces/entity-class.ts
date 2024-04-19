import type { ObjectLiteral } from 'typeorm';

/**
 * Represents a class constructor type for an entity.
 */
export type EntityClass<E extends ObjectLiteral> = { new(): E };
