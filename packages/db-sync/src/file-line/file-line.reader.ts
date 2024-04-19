import { FileLine } from './file-line.js';
import LineReader from 'line-by-line';

/**
 * Extends FileLine to provide functionality for reading lines from a file asynchronously.
 */
export class FileLineReader extends FileLine {
    #reader?: {
        reader: LineReader;
        promise: Promise<void>;
    };

    /**
     * Determines whether the FileLineReader is currently reading from the file.
     */
    get isReading(): boolean {
        return !!this.#reader;
    }

    /**
     * Begins asynchronously reading lines from the file, calling the provided callback for each line read.
     * @param callback A function that receives each line read from the file and a function to close the reader.
     * @returns A promise that resolves when all lines are read, or the reading is manually stopped.
     */
    read(
        callback: (
            line: string,
            close: () => void
        ) => void | Promise<void>
    ): Promise<void> {
        if (this.#reader) {
            throw new Error('This instance is already initialized.');
        }

        const reader = new LineReader(this.path, {
            encoding: 'utf8',
            skipEmptyLines: true
        });

        const promise = new Promise<void>((resolve, reject) => {
            let error: Error | null = null;
            let stop = false;
            const closeHandler = () => {
                stop = true;
                reader.close();
            };

            reader.once('end', () => {
                reader.removeAllListeners();
                this.#reader = undefined;

                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });

            reader.on('line', async line => {
                try {
                    if (stop) { return; }
                    
                    const v = callback(line, closeHandler);
                    if (v instanceof Promise) {
                        reader.pause();
                        await v;
                        reader.resume();
                    }
                } catch (err: any) {
                    error = err;
                    closeHandler();
                }
            });
        });

        this.#reader = { reader, promise };
        return promise;
    }

    /**
     * Closes the active reader, if one exists.
     * @returns A promise that resolves when the reader has been closed.
     */
    close(): Promise<void> {
        if (!this.#reader) {
            throw new Error('Not an active reading process to close.');
        }

        const { reader, promise } = this.#reader;
        reader.close();
        return promise;
    }
}
