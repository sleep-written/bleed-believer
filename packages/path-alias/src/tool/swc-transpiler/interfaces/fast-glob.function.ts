import type { Entry, Options, Pattern } from 'fast-glob';

export type FastGlobFunction = (
    source: Pattern | Pattern[],
    options: Options & { objectMode: true }
) => Promise<Entry[]>;