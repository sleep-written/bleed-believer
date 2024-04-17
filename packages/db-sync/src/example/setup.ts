import { dataSourceTarget } from './data-source.source.js';
import { dataSourceSource } from './data-source.target.js';
import { sourceSeeders } from './seeders/source-seeders.js';
import { targetSeeders } from './seeders/target-seeders.js';

const queue = [
    {
        dataSource: dataSourceSource,
        seeders: sourceSeeders
    },
    {
        dataSource: dataSourceTarget,
        seeders: targetSeeders
    },
];

await Promise.all(queue.map(async ({ dataSource, seeders }) => {
    // Rebuild the database
    await dataSource.initialize();
    await dataSource.synchronize(true);

    // execute seeds
    await dataSource.transaction(async manager => {
        for (const seederClass of seeders) {
            const seeder = new seederClass(manager);
            await seeder.start();
        }
    });

    // Close connection
    await dataSource.destroy();
}));
