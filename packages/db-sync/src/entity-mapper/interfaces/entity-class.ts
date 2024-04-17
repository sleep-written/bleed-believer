import type { ObjectLiteral } from 'typeorm';

export type EntityClass<E extends ObjectLiteral> = { new(): E };
