import { Contract } from '@example/entities/contract.entity.js';
import { Seeder } from '../seeder.js';

export class ContractSeeder extends Seeder {
    async start(): Promise<void> {
        const items = await this.getJSONData('./mocks/contract.json');
        for (const item of items) {
            await this.set(Contract, 'id', {
                id: item.id,
                corr: item.corr,
                date: new Date(item.date),

                user: item.userId,
                client: item.clientId,
            });
        }
    }
}