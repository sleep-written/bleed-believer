import { rm } from 'fs/promises';
import test from 'ava';

import { createDataSource, deploySeeds } from '../../dummy-db/index.js';
import { FilterBuilder } from '../filter-builder.js';
import { Event } from '../../dummy-db/entities/event.entity.js';

const database = './append-filter-db.case01.db';
const dataSource = createDataSource(database);
test.before(async _ => {
    await dataSource.initialize();
    await deploySeeds();
});

test.after(async _ => {
    await dataSource.destroy();
    await rm(database);
});

test('getMany()', async t => {
    const target = new FilterBuilder({
        logic: 'and',
        filters: [
            {
                field: 'character.name',
                operator: 'startswith',
                value: 'Ste'
            }
        ]
    });

    const qb = target.append(Event
        .createQueryBuilder('Event')
        .select([
            'Event',
            'Detail',
            'Character',
        ])
        .innerJoin('Event.details', 'Detail')
        .innerJoin('Detail.character', 'Character')
    );

    const result = await qb
        .getMany();

    t.is(result.length, 2);
    t.is(
        result
            .map(x => x.details?.length ?? 0)
            .reduce((prev, curr) => prev + curr, 0),
        2
    );

    t.true(
        result
            .map(e => (e.details ?? [])
                .map(d => d.character?.name ?? '')
            )
            .flat(1)
            .some(x => x.match(/stella/gi))
    );

    t.false(
        result
            .map(e => (e.details ?? [])
                .map(d => d.character?.name ?? '')
            )
            .flat(1)
            .some(x => x.match(/emily/gi))
    );
});

test('getRawMany()', async t => {
    const target = new FilterBuilder({
        logic: 'and',
        filters: [
            {
                field: 'name',
                operator: 'startswith',
                value: 'Ste'
            }
        ]
    }, 'CTE');

    const baseQb = Event
        .createQueryBuilder('Event')
        .select([
            'Event.title        AS [title]',
            'Event.description  AS [description]',
            'Character.name     AS [name]',
            'Detail.description AS [description]',
        ])
        .innerJoin('Event.details', 'Detail')
        .innerJoin('Detail.character', 'Character');

    const qb = target.append(dataSource
        .createQueryBuilder()
        .from(`(${baseQb.getQuery()})`, 'CTE')
        .setParameters(baseQb.getParameters())
        .select('CTE.*')
    );

    const result = await qb
        .getRawMany();

    t.is(result.length, 2);
    t.true(
        result
            .map(x => x?.['name'] as string)
            .some(x => x.match(/stella/gi))
    );

    t.false(
        result
            .map(x => x?.['name'] as string)
            .some(x => x.match(/emily/gi))
    );
});