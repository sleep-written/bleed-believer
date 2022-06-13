import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

export class Json<T> {
    private _path: string;

    constructor(path: string) {
        this._path = resolve(path);
    }

    loadSync(): T {
        const text = readFileSync(this._path, 'utf-8');
        return JSON.parse(text);
    }

    async load(): Promise<T> {
        const text = await readFile(this._path, 'utf-8');
        return JSON.parse(text);
    }
}