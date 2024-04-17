import { createWriteStream, type WriteStream } from 'fs';
import { FileLine } from './file-line.js';

export class FileLineWriter extends FileLine {
    #stream?: WriteStream;
    get isWriting(): boolean {
        return !!this.#stream;
    }

    async append(
        callback: (append: (s: string) => Promise<void>) => Promise<void>
    ): Promise<void> {
        try {
            // Declare writter parts
            this.#stream = createWriteStream(this.path, {
                flags: 'a',
                encoding: 'utf-8',
                emitClose: true
            });
            
            let empty = await this.empty();
            return new Promise<void>(async (resolve, reject) => {
                // Handler to add new lines into the file
                const appendHandler = async (v: string) => {
                    if (empty) {
                        empty = false;
                    } else {
                        v = `\n${v}`;
                    }

                    if (!this.#stream!.write(v)) {
                        // Wait until the buffer can write again
                        await new Promise(r => this.#stream!.once('drain', r));
                    }
                };

                let error: Error | undefined;
                this.#stream!.once('error', err => { error = err });
                this.#stream!.once('close', () => {
                    this.#stream = undefined;
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                try {
                    await callback(appendHandler);
                    this.#stream!.end();
                } catch (err: any) {
                    this.#stream!.end();
                    this.#stream!.emit('error', err);
                } finally {
                    this.#stream!.close();
                }
            });
        } catch (err) {
            if (this.#stream) {
                this.#stream.emit('error', err);
            } else {
                throw err;
            }
        }
    }
}