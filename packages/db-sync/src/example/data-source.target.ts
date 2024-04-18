import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';

const currentPath = resolve(fileURLToPath(import.meta.url), '..');
export const dataSourceTarget = new DataSource({
    type: 'sqlite',
    database: resolve(currentPath, '../../database.target.db'),
    entities: [ resolve(currentPath, './entities/*.entity.ts') ],
    synchronize: false
});