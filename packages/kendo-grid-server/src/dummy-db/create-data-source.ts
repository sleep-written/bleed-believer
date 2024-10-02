import { DataSource } from 'typeorm';

export function createDataSource(database: string): DataSource {
    return new DataSource({
        type: 'sqlite',
        database,
        synchronize: true,
        entities: [
            './dist/dummy-db/entities/*.entity.js'
        ]
    });
}