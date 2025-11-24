import type { Diff, CacheLoadInject, DirentObject, TSConfigObject } from './interfaces/index.js';

import { basename, dirname } from 'path';
import { setTimeout } from 'timers/promises';
import { Watch } from './watch.js';
import test from 'ava';

class Inject implements CacheLoadInject {
    #filesystem: Record<string, string>;

    constructor(filesystem: Record<string, string>) {
        this.#filesystem = filesystem;
    }

    async readFile(path: string): Promise<Buffer> {
        const text = this.#filesystem[path];
        if (typeof text !== 'string') {
            throw new Error(`The file "${path}" doesn't exists`);
        }

        return Buffer.from(text, 'utf-8');
    }
}

class TSConfig implements TSConfigObject {
    #filesystem: Record<string, string>;

    constructor(filesystem: Record<string, string>) {
        this.#filesystem = filesystem;
    }

    async *getSourceCode(): AsyncGenerator<DirentObject> {
        const paths = Object.keys(this.#filesystem);
        for (const path of paths) {
            yield {
                isFile: () => true,
                name: basename(path),
                parentPath: dirname(path)
            };
        }
    }
}

test('Watch file changes', async t => {
    const filesystem: Record<string, string> = {
        '/src/joder.ts': 'joder',
        '/src/chaval.ts': 'chaval',
        '/src/lib/foo.ts': 'foo',
        '/src/lib/bar.ts': 'bar'
    };

    const inject = new Inject(filesystem);
    const tsConfig = new TSConfig(filesystem);

    const response = await new Promise<Diff[]>(async resolve => {
        const watch = new Watch(1_000, tsConfig, inject);
        const diffs: Diff[] = [];
        watch.on(diff => {
            diffs.push(diff);
            if (diffs.length >= 4) {
                watch.abort();
                resolve(diffs);
            }
        });

        watch.initialize();
        await setTimeout(50);

        await setTimeout(1_000);
        filesystem['/src/lib/baz.ts'] = 'baz';

        await setTimeout(1_000);
        filesystem['/src/joder.ts'] = 'chaval';

        await setTimeout(1_000);
        delete filesystem['/src/lib/foo.ts'];
    });

    t.deepEqual(response, [
        {
            created: [
                '/src/joder.ts',
                '/src/chaval.ts',
                '/src/lib/foo.ts',
                '/src/lib/bar.ts'
            ],
            updated: [],
            deleted: []
        },
        {
            created: [ '/src/lib/baz.ts' ],
            updated: [],
            deleted: []
        },
        {
            created: [],
            updated: [ '/src/joder.ts' ],
            deleted: []
        },
        {
            created: [],
            updated: [],
            deleted: [ '/src/lib/foo.ts' ]
        }
    ]);
});