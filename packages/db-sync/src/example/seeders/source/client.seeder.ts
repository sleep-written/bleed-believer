import { Client } from '@example/entities/client.entity.js';
import { Seeder } from '../seeder.js';

export class ClientSeeder extends Seeder {
    async start(): Promise<void> {
        const items = await this.getJSONData('./mocks/client.json');
        for (const item of items) {
            await this.set(Client, 'id', {
                id: item.id,
                name: item.name,
                address: item.address
            });
        }
    }
}
