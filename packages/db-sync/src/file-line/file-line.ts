import { access, rm, stat } from 'fs/promises';
import { basename, join } from 'path';

export class FileLine {
    #path: string;
    get path(): string {
        return this.#path;
    }

    get filename(): string {
        return basename(this.#path);
    }

    constructor(...pathParts: [ string, ...string[] ]) {
        if (pathParts.length > 1) {
            this.#path = join(...pathParts);
        } else {
            this.#path = pathParts[0];
        }
    }

    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    async empty(strict?: boolean): Promise<boolean> {
        if (!await this.exists()) {
            if (strict) {
                throw new Error(`The file doesn't exists`);
            } else {
                return true;
            }
        }

        const { size } = await stat(this.#path);
        return size === 0;
    }

    async kill(force?: boolean): Promise<void> {
        return rm(this.#path, { force: force ?? false });
    }
}