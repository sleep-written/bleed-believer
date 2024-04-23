import { Product } from '@example/entities/product.entity.js';
import { Seeder } from '../seeder.js';

export class ProductSeeder extends Seeder {
    async start(): Promise<void> {
        const rawItems = await this.getJSONData('./mocks/product.json');
        const items = new Map<number, Product>();
        for (const rawItem of rawItems) {
            const item = await this.set(Product, 'id', {
                id: rawItem.id,
                cod: rawItem.cod,
                description: rawItem.description
            });

            items.set(item.id, item);
        }

        for (const rawItem of rawItems.filter(x => x.parentId != null)) {
            const item = items.get(rawItem.id);
            if (!item) {
                throw new Error(`\`Product.id = ${rawItem.id}\` not found.`);
            }

            item.parent = items.get(rawItem.parentId);
            if (item.parent) {
                await this.manager.save(item);
            }
        }
    }
}