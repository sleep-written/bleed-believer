import type { Diff, DirentObject, CacheLoadInject } from './interfaces/index.js';

import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

export class Cache {
    static async load(
        dirents: Iterable<DirentObject> | AsyncIterable<DirentObject>,
        inject?: CacheLoadInject
    ): Promise<Cache> {
        const injected: Required<CacheLoadInject> = {
            readFile:   inject?.readFile?.bind(inject) ?? readFile,
            createHash: inject?.createHash?.bind(inject) ?? createHash
        };

        const fileCache = new Cache();
        for await (const dirent of dirents) {
            const path = resolve(dirent.parentPath, dirent.name);
            if (!dirent.isFile()) {
                throw new Error(`The dirent "${path}" isn't a file`);
            }

            const code = await injected.readFile(path);
            const hash = injected.createHash('sha512')
                .update(code)
                .digest('hex');

            fileCache.#cache.set(path, hash);
        }

        return fileCache;
    }

    #cache = new Map<string, string>();
    *[Symbol.iterator](): Generator<{ path: string; hash: string; }> {
        for (const [ path, hash ] of this.#cache) {
            yield { path, hash };
        }
    }

    constructor(cache?: Map<string, string> | Record<string, string>) {
        if (cache instanceof Map) {
            this.#cache = cache;
        } else if (cache) {
            this.#cache = new Map(Object.entries(cache));
        } else {
            this.#cache = new Map();
        }
    }

    paths(): MapIterator<string> {
        return this.#cache.keys();
    }

    update(incoming: Cache): Diff {
        const diff: Diff = {
            created: [],
            updated: [],
            deleted: []
        };

        for (const { path, hash } of incoming) {
            if (this.#cache.has(path) && this.#cache.get(path) !== hash) {
                diff.updated.push(path);
                this.#cache.set(path, hash);

            } else if (!this.#cache.has(path)) {
                diff.created.push(path);
                this.#cache.set(path, hash);

            }
        }

        const paths = [ ...this.#cache.keys() ];
        for (const path of paths) {
            if (!incoming.#cache.has(path)) {
                diff.deleted.push(path);
                this.#cache.delete(path);
            }
        }

        return diff;
    }
}