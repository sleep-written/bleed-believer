import type { CacheLoadInject, HashObject, DirentObject } from './interfaces/index.js';

import { basename, dirname } from 'path';
import { Cache } from './cache.js';
import test from 'ava';

class Hash implements HashObject {
    #byte = Buffer.from([]);

    update(byte: Buffer): HashObject {
        this.#byte = Buffer.concat([
            this.#byte,
            byte
        ]);

        return this;
    }

    digest(_: 'hex'): string {
        const value = this.#byte.toString('utf-8');
        return `// hashed\n${value}`;
    }
}

class Inject implements CacheLoadInject {
    filesystem: Record<string, string>;

    constructor(fs?: Record<string, string>) {
        this.filesystem = fs ?? {};
    }

    async readFile(path: string): Promise<Buffer> {
        const code = this.filesystem[path];
        if (typeof code !== 'string') {
            throw new Error(`The path "${path}" doesn't exists`);
        }

        return Buffer.from(code, 'utf-8');
    }

    createHash(_: 'sha256' | 'sha512'): HashObject {
        return new Hash();
    }

    dirents(): DirentObject[] {
        return Object
            .keys(this.filesystem)
            .map(x => ({
                name: basename(x),
                parentPath: dirname(x),
                isFile: () => true,
            }));
    }
}

test('Load from filesystem', async t => {
    const injectA = new Inject({
        '/src/joder.ts': 'joder',
        '/src/chaval.ts': 'chaval',
        '/src/lib/foo.ts': 'foo',
        '/src/lib/bar.ts': 'bar'
    });
    const cacheA = await Cache.load(injectA.dirents(), injectA);

    const injectB = new Inject({
        '/src/joder.ts': 'joder',
        '/src/chaval.ts': 'ñee',
        '/src/lib/foo.ts': 'foo',
        '/src/lib/baz.ts': 'baz'
    });
    const cacheB = await Cache.load(injectB.dirents(), injectB);

    const diff = cacheA.update(cacheB);
    t.deepEqual(diff, {
        created: [ '/src/lib/baz.ts' ],
        updated: [ '/src/chaval.ts' ],
        deleted: [ '/src/lib/bar.ts' ]
    });
});

test('Get simple diff', t => {
    const cacheA = new Cache({
        '/src/index.ts': 'joder',
        '/src/lib/foo.ts': 'foo',
        '/src/lib/bar.ts': 'bar'
    });

    const cacheB = new Cache({
        '/src/index.ts': 'chaval',
        '/src/lib/bar.ts': 'bar',
        '/src/lib/baz.ts': 'baz'
    });

    const diff = cacheA.update(cacheB);
    t.deepEqual(diff, {
        created: [ '/src/lib/baz.ts' ],
        updated: [ '/src/index.ts' ],
        deleted: [ '/src/lib/foo.ts' ],
    });
});