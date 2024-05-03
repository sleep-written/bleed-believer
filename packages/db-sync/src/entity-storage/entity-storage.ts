import { FileLineReader, FileLineWriter } from '../file-line/index.js';
import { access, mkdir, stat, open } from 'fs/promises';
import { dirname } from 'path';

/**
 * Manages storage of plain text data in a file system.
 * This class provides functionalities to read and write text lines to and from a file.
 */
export class EntityStorage {
    #reader: FileLineReader;
    #writer: FileLineWriter;

    #path: string;
    /**
     * Returns the file path associated with the storage.
     */
    get path(): string {
        return this.#path;
    }

    /**
     * Creates an instance of EntityStorage.
     * @param path The file path where the text data is stored.
     */
    constructor(path: string) {
        this.#path = path;
        this.#reader = new FileLineReader(path);
        this.#writer = new FileLineWriter(path);
    }

    async createFolder(): Promise<void> {
        const path = dirname(this.#path);
        let error: Error | null = null;

        try {
            await access(path);
            const s = await stat(path);
            if (!s.isDirectory()) {
                error = new Error(`The path "${path}" isn't a directory.`);
            }
        } catch {
            await mkdir(path, { recursive: true });
        }

        if (error) {
            throw error;
        }
    }

    /**
     * Deletes the file associated with this storage.
     * @returns A promise that resolves when the file is successfully deleted.
     */
    kill(): Promise<void> {
        return this.#writer.kill(true);
    }

    exists(): Promise<boolean> {
        return this.#writer.exists();
    }

    async touch(): Promise<void> {
        const fileHandle = await open(this.#path, 'a');
        return fileHandle.close();
    }

    /**
     * Writes an array of text lines to the file.
     * @param lines Array of strings to be written to the file.
     * @returns A promise that resolves when all lines are successfully appended.
     */
    write(items: string[]): Promise<void> {
        return this.#writer.append(async append => {
            for (const item of items) {
                await append(item);
            }
        });
    }

    /**
     * Reads text lines from the file and processes them in chunks.
     * @param chunkSize The number of lines to process at a time.
     * @param callback A callback function to handle each chunk of lines.
     * @returns A promise that resolves when all lines have been read and processed.
     */
    async read(
        chunkSize: number,
        callback: (lines: string[]) => void | Promise<void>
    ): Promise<void> {
        let chunk: string[] = [];
        let error: Error | null = null;
        await this.#reader.read(async (line, close) => {
            try {
                chunk.push(line);
                if (chunk.length >= chunkSize) {
                    await callback(chunk);
                    chunk = [];
                }
            } catch (err: any) {
                error = err;
                close();
            }
        });

        if (error) {
            throw error;
        } else if (chunk.length > 0) {
            await callback(chunk);
        }
    }
}