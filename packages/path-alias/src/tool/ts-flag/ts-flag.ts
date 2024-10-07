import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { tmpdir } from 'os';

import { isFileExistsSync } from '@tool/is-file-exists/index.js';

export class TsFlag {
    #isParsingSourceCode!: boolean;
    get isParsingSourceCode(): boolean {
        if (typeof this.#isParsingSourceCode != 'boolean') {
            this.#isParsingSourceCode = isFileExistsSync(this.#path);
            if (this.#isParsingSourceCode) {
                rmSync(this.#path, { force: true });
            }
        }

        return this.#isParsingSourceCode;
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
        if (!this.#isParsingSourceCode) {
            this.#isParsingSourceCode = true;
            const dir = dirname(this.#path);
            mkdirSync(dir, { recursive: true });

            const bytes = Buffer.from([]);
            writeFileSync(this.#path, bytes);
        }
    }
}
