import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { tmpdir } from 'os';

import { isFileExistsSync } from '@tool/is-file-exists/index.js';

export class TsFlag {
    #parsingSourceCode!: boolean;
    get parsingSourceCode(): boolean {
        if (typeof this.#parsingSourceCode != 'boolean') {
            this.#parsingSourceCode = isFileExistsSync(this.#path);
        }

        return this.#parsingSourceCode;
    }

    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(name: string) {
        this.#path = resolve(
            tmpdir(), '@bleed-believer',
            'path-alias', name
        );
    }

    markAsParsingSourceCode(): void {
        if (!this.#parsingSourceCode) {
            this.#parsingSourceCode = true;
            const dir = dirname(this.#path);
            mkdirSync(dir, { recursive: true });

            const bytes = Buffer.from([]);
            writeFileSync(this.#path, bytes);
        }
    }
}
