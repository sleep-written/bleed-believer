import type { ExpressRequest, ODataQsOptions } from './interfaces/index.js';

export function odataQsParser(req: ExpressRequest): ODataQsOptions {
    const { query } = req;
    const out: ODataQsOptions = {};

    // Parse pagination
    if (query.take || query.skip) {
        out.pagination = {
            take: parseInt(query.take?.toString() ?? '0'),
            skip: parseInt(query.skip?.toString() ?? '0')
        };

        if (isNaN(out.pagination.take)) {
            out.pagination.take = 0;
        } else {
            out.pagination.take = Math.trunc(Math.abs(out.pagination.take));
        }

        if (isNaN(out.pagination.skip)) {
            out.pagination.skip = 0;
        } else {
            out.pagination.skip = Math.trunc(Math.abs(out.pagination.skip));
        }
    }

    // Parse sort
    if (typeof query?.sort === 'string') {
        out.sort = query.sort
            .split(';')
            .map(x => {
                const field = x.match(/^.+(?=\((asc|desc)\)$)/g);
                const dir = x.match(/(?<=\()(asc|desc)(?=\)$)/g);

                if (!field || !dir) {
                    throw new Error('The format of the sort item is invalid. The format is "name_field(asc|desc)"');
                } else {
                    return {
                        field: field[0] as string,
                        dir: dir[0] as 'asc' | 'desc'
                    };
                }
            });
    }

    // Parse filters
    if (typeof query?.filter === 'string') {
        out.filter = JSON.parse(decodeURIComponent(query.filter));
    }

    return out;
}