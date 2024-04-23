import { ContractDetail } from '@example/entities/contract-detail.entity.js';
import { Contract } from '@example/entities/contract.entity.js';
import { Product } from '@example/entities/product.entity.js';
import { Seeder } from '../seeder.js';

export class ContractDetailSeeder extends Seeder {
    async start(): Promise<void> {
        const rawItems = await this.getJSONData('./mocks/product-detail.json');
        for (const rawItem of rawItems) {
            const contract = new Contract();
            contract.id = rawItem.contractId;

            const product = new Product();
            product.id = rawItem.productId;

            await this.set(ContractDetail, 'id', {
                quantity: rawItem.quantity,
                price: rawItem.price,
                id: rawItem.id,
                contract,
                product,
            });
        }
    }
}