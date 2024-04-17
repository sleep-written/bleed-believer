import type { EntityClass } from './entity-class.js';

export interface RelationMetadata {
    propertyName: string;
    recursive: boolean;

    relatedEntity: EntityClass<any>;
    relatedPK: string;
}