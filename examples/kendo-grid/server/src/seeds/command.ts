import { Command, type Executable } from '@bleed-believer/commander';

import { dataSource } from '@/data-source.js';
import { seeders } from './seeders/index.js';
import npmlog from 'npmlog';

@Command({
    name: 'Seeder injection',
    path: 'seeds'
})
export class SeedsCommand implements Executable {
    async start(): Promise<void> {
        npmlog.info('seeds', 'Connecting to DB...');
        await dataSource.initialize();
        npmlog.info('seeds', 'Initializing seed injection process...');

        await dataSource.transaction(async manager => {
            for (const seeder of seeders) {
                const o = new seeder(manager);
                npmlog.info('seeds', `Executing seeder "${seeder.name}"...`);
                await o.execute();
            }
        });
        
        npmlog.info('seeds', 'Closing connection...');
        await dataSource.destroy();
    }
}