import { dirname, resolve } from 'path';
import { tmpdir } from 'os';
import { mkdir } from 'fs/promises';

import { FlagDB } from '../flag-db/index.js';

const path = resolve(
    tmpdir(), '@bleed-believer/path-alias',
    `${process.pid}.bin`
);

await mkdir(dirname(path), { recursive: true });
const tsNodeFlagDB = new FlagDB(path, 'isTsNode');

let isTsNodeCache: boolean
export function isTsNode(): boolean {
    if (!isTsNodeCache) {
        try {
            const value = tsNodeFlagDB.getSync()?.isTsNode;
            if (value) {
                isTsNodeCache = true;
            }
    
            return value;

        } catch {
            return false;

        }

    } else {
        return true;

    }
}

export function markAsTsNode(): void {
    if (!isTsNodeCache) {
        isTsNodeCache = true;
        tsNodeFlagDB.setSync({ isTsNode: true });
    }
}
