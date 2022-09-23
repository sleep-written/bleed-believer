import type { TsconfigMain } from './interfaces/index.js';

import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { toJson } from 'tsconfck';

export class Json {
    private _path: string;

    constructor(path: string) {
        this._path = resolve(path);
    }

    loadSync(): TsconfigMain {
        const text = readFileSync(this._path, 'utf-8');
        const data = toJson(text);
        return JSON.parse(data);
    }

    async load(): Promise<TsconfigMain> {
        const text = await readFile(this._path, 'utf-8');
        const data = toJson(text);
        return JSON.parse(data);
    }
}