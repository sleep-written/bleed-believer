import type { ObjectLiteral } from 'typeorm';

import { FileLineReader, FileLineWriter } from '../file-line/index.js';
import { EntityMapper } from '../entity-mapper/index.js';

export class EntityStorage<E extends ObjectLiteral> {
    #entityMapper: EntityMapper<E>;
    #reader: FileLineReader;
    #writer: FileLineWriter;

    get path(): string {
        return this.#writer.path;
    }

    constructor(entityMapper: EntityMapper<E>, path: string) {
        this.#entityMapper = entityMapper;
        this.#reader = new FileLineReader(path);
        this.#writer = new FileLineWriter(path);
    }

    delete(): Promise<void> {
        return this.#writer.kill(true);
    }
    
    write(items: E[]): Promise<void> {
        return this.#writer.append(async append => {
            for (const item of items) {
                const text = this.#entityMapper.stringify(item);
                await append(text);
            }
        });
    }

    async read(
        chunkSize: number,
        callback: (items: E[]) => void | Promise<void>
    ): Promise<void> {
        let chunk: E[] = [];
        let error: Error | null = null;
        await this.#reader.read(async (line, close) => {
            try {
                const item = this.#entityMapper.parse(line);
                chunk.push(item);
    
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