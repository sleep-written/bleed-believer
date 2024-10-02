import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'fs';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { dirname } from 'path';

import { isFileExists, isFileExistsSync } from '../is-file-exists/index.js';

export class FlagDB<Flag extends string> {
    #flags: Flag[];
    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path: string, ...flags: [Flag, ...Flag[]]) {
        this.#path = path;
        this.#flags = flags;
        // process.once('beforeExit', async () => {
        //     await rm(this.#path, { force: true });
        // });
    }

    #parse(buffer: Buffer): Record<NoInfer<Flag>, boolean> {
        const bits: number[] = [];
        for (const byte of buffer) {
            byte
                .toString(2)
                .split('')
                .reverse()
                .map(bit => parseInt(bit))
                .forEach(x => bits.push(x));
        }

        const out: Record<string, boolean> = {};
        this.#flags.forEach((k, i) => {
            out[k] = bits[i] === 1;
        });

        return out;
    }

    getSync(): Record<NoInfer<Flag>, boolean> {
        const buffer = readFileSync(this.#path, { flag: 'rs' });
        return this.#parse(buffer);
    }

    async get(): Promise<Record<NoInfer<Flag>, boolean>> {
        const buffer = await readFile(this.#path, { flag: 'rs' });
        return this.#parse(buffer);
    }

    #stringify(flags: Record<NoInfer<Flag>, boolean>): Buffer {
        let byte = '';
        const bytes: number[] = [];
        this.#flags
            .map(k => flags[k] ? '1' : '0')
            .forEach(bit => {
                byte = bit + byte;
                if (byte.length >= 8) {
                    bytes.push(parseInt(byte, 2));
                    byte = '';
                }
            });

        if (byte.length > 0) {
            bytes.push(parseInt(byte, 2));
        }

        const buffer = Buffer.from(bytes);
        return buffer;
    }

    async set(flags: Record<NoInfer<Flag>, boolean>): Promise<void> {
        const buffer = this.#stringify(flags);
        const folder = dirname(this.#path);
        if (!await isFileExists(folder)) {
            await mkdir(folder, { recursive: true });
        }

        return writeFile(this.#path, buffer, { flag: 'w' });
    }

    setSync(flags: Record<NoInfer<Flag>, boolean>): void {
        const buffer = this.#stringify(flags);
        const folder = dirname(this.#path);
        if (!isFileExistsSync(folder)) {
            mkdirSync(folder, { recursive: true });
        }

        const file = openSync(this.#path, 'w');
        writeFileSync(file, buffer);
        closeSync(file);
    }
}
