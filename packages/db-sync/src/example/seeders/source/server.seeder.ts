import { Server } from '@example/entities/server.entity.js';
import { Seeder } from '../seeder.js';

export class ServerSeeder extends Seeder {
    async start(): Promise<void> {
        const data = await this.getJSONData('./mocks/server.json');
        for (const item of data) {
            await this.set(Server, 'id', {
                id: item.id,
                ip: item.ip,
                port: item.port,
                name: item.name,
                version: item.version
            });
        }
    }
}