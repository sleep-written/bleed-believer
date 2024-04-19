import type { DataSource } from 'typeorm';
import type { EntitySync } from '../entity-sync/index.js';
import type { DBSyncOptions } from './db-sync.options.js';

/**
 * Manages the synchronization process between two data sources using defined entity synchronization configurations.
 */
export class DBSync {
    /**
     * Private field to hold the list of `EntitySync` configurations.
     */
    #entitySyncs: EntitySync<any>[];

    /**
     * Private logging function, undefined if logging is not enabled.
     */
    #log?: (...a: any[]) => void;

    /**
     * Constructs a new instance of `DBSync`.
     * 
     * @param entitySyncs An array of `EntitySync` instances to handle the data synchronization for each entity.
     * @param options Configuration options for DBSync, including custom logging functions.
     */
    constructor(
        entitySyncs: EntitySync<any>[],
        options?: DBSyncOptions
    ) {
        this.#entitySyncs = entitySyncs;
        const verbose = options?.verbose;
        if (verbose) {
            this.#log = (...a) => {
                if (typeof verbose === 'function') {
                    verbose(...a);
                } else {
                    console.log(...a);
                }
            }
        }
    }

    /**
     * Executes the data synchronization process between the source and target databases.
     * 
     * @param source The TypeORM DataSource for the source database.
     * @param target The TypeORM DataSource for the target database.
     * @returns A promise that resolves when the data synchronization process is complete.
     */
    async execute(
        source: DataSource,
        target: DataSource
    ): Promise<void> {
        const sourceManager = source.manager;
        return target.transaction(async targetManager => {
            this.#log?.('Initializing data dump process...');
            for (const entitySync of this.#entitySyncs.slice().reverse()) {
                await entitySync.createFile(sourceManager);
                this.#log?.(`\`${entitySync.entityName}\` entity data from source DB saved into temp file.`);

                await entitySync.clearDataFromDB(targetManager);
                this.#log?.(`\`${entitySync.entityName}\` entity data pruned from target DB.`);
            }

            this.#log?.('Initializing data migration process...');
            for (const entitySync of this.#entitySyncs) {
                await entitySync.insertIntoDB(targetManager);
                this.#log?.(`\`${entitySync.entityName}\` entity data inserted into target DB.`);

                await entitySync.clearFile();
                this.#log?.(`\`${entitySync.entityName}\` entity data temp file deleted.`);
            }
        });
    }
}