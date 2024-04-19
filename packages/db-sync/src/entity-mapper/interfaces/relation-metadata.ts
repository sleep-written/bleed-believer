import type { EntityClass } from './entity-class.js';

/**
 * Defines metadata for a relationship between entities.
 */
export interface RelationMetadata {
    /**
     * The property name in the entity that holds the relation.
     */
    propertyName: string;

    /**
     * Indicates if the relationship is recursive (i.e., the entity is related to itself).
     */
    recursive: boolean;

    /**
     * The class type of the related entity.
     */
    relatedEntity: EntityClass<any>;

    /**
     * The primary key of the related entity.
     */
    relatedPK: string;
}