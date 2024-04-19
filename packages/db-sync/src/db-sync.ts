import type { EntitySync } from './entity-sync/index.js';
import type { DataSource } from 'typeorm';

export class DBSync {
    #entitySyncs: EntitySync<any>[];

    constructor(entitySyncs: EntitySync<any>[]) {
        this.#entitySyncs = entitySyncs;
    }

    async execute(
        sourceConnection: DataSource,
        targetConnection: DataSource
    ): Promise<void> {
        const sourceManager = sourceConnection.manager;
        return targetConnection.transaction(async targetManager => {
            for (const entitySync of this.#entitySyncs.slice().reverse()) {
                await entitySync.createFile(sourceManager);
                await entitySync.clearDataFromDB(targetManager);
            }

            for (const entitySync of this.#entitySyncs) {
                await entitySync.insertIntoDB(targetManager);
                await entitySync.clearFile();
            }
        });
    }
}