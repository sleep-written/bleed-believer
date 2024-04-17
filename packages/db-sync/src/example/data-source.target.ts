import { join } from 'path';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';

const currentPath = join(fileURLToPath(import.meta.url), '..');
export const dataSourceTarget = new DataSource({
    type: 'sqlite',
    database: join(currentPath, '../../database.target.db'),
    entities: [ join(currentPath, './entities/*.entity.ts') ],
    synchronize: false
});