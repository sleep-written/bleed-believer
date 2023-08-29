import { pathResolve } from '@bleed-believer/path-alias';
import { DataSource } from 'typeorm';
import { resolve } from 'path';

export const dataSource = new DataSource({
    type: 'sqlite',
    database: resolve('./database.sqlite'),
    entities: [
        pathResolve('entities/*.entity.ts')
    ],
    migrations: [
        pathResolve('migrations/*.ts')
    ]
});