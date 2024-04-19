import { access, rm, stat } from 'fs/promises';
import { basename, join } from 'path';

/**
 * Provides base functionality for file operations on a specific path, including
 * checking existence, checking emptiness, and deletion.
 */
export class FileLine {
    #path: string;

    /**
     * Gets the full path of the file.
     */
    get path(): string {
        return this.#path;
    }

    /**
     * Gets the filename extracted from the full path.
     */
    get filename(): string {
        return basename(this.#path);
    }

    /**
     * Constructs a new FileLine object for managing file operations.
     * @param pathParts An array of path segments that will be joined to
     * form the full file path.
     */
    constructor(...pathParts: [ string, ...string[] ]) {
        if (pathParts.length > 1) {
            this.#path = join(...pathParts);
        } else {
            this.#path = pathParts[0];
        }
    }

    /**
     * Checks if the file exists.
     * @returns A promise that resolves to true if the file exists, false otherwise.
     */
    async exists(): Promise<boolean> {
        try {
            await access(this.#path);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks if the file is empty.
     * @param strict If true, throws an error if the file does not exist.
     * @returns A promise that resolves to true if the file is empty, false otherwise.
     */
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

    /**
     * Deletes the file.
     * @param force If true, forces the deletion even if the file is not empty.
     * @returns A promise that resolves when the file is deleted.
     */
    async kill(force?: boolean): Promise<void> {
        return rm(this.#path, { force: force ?? false });
    }
}