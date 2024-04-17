import type { BaseEntity, EntityManager, ObjectLiteral } from 'typeorm';

export abstract class Seeder {
    #manager: EntityManager;
    protected get manager(): EntityManager {
        return this.#manager;
    }

    constructor(manager: EntityManager) {
        this.#manager = manager;
    }

    protected async set<E extends ObjectLiteral>(
        entity: { new(): E; },
        key: keyof E,
        data: Partial<Omit<E, keyof BaseEntity>>,
    ): Promise<E> {
        const o = new entity();
        if (key != null) {
            const metadata = this.#manager
                .connection
                .getMetadata(entity);

            const pk = metadata.columns
                ?.find(({ isPrimary }) => isPrimary)
                ?.propertyName as keyof E;

            if (pk == null) {
                throw new Error('PK not found');
            } else if (key !== pk) {
                const tmp = await this.#manager.findOne(entity, {
                    select: { [pk]: true } as any,
                    where:  { [key]: (data as any)[key] } as any
                });
    
                if (tmp) {
                    (o as any)[pk] = (tmp as any)[pk];
                }
            }
        }

        Object
            .entries(data)
            .filter(([ _, v ]) => v != null)
            .map(([ key, value ]) => {
                (o as Record<string, any>)[key] = value;
            })

        return this.#manager.save(o);
    }

    abstract start(): Promise<void>;
}