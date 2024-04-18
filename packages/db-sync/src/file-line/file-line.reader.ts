import { FileLine } from './file-line.js';
import LineReader from 'line-by-line';

/**
 * Manages reading lines from a file asynchronously using a `ReadStream` and `Interface` from
 * Node.js's `readline` module.
 */
export class FileLineReader extends FileLine {
    #reader?: {
        reader: LineReader;
        promise: Promise<void>;
    };

    /**
     * Indicates whether the `FileLineReader` instance is reading a file.
     * @returns {boolean} `true` if the reader is initialized, `false` otherwise.
     */
    get isReading(): boolean {
        return !!this.#reader;
    }

    /**
     * Starts reading lines from the file asynchronously. Each line read will call the provided callback function.
     * The reading process can be stopped prematurely by calling the `close` function provided to the callback.
     * @param {(line: string, close: () => void) => void | Promise<void>} callback - A function to call for each
     * line read from the file.
     * The callback receives the line as a string and a `close` function that can be called to stop reading.
     * @returns {Promise<void>} A promise that resolves when all lines are read or the reader is manually closed,
     * or rejects if an error occurs.
     * @throws {Error} If this instance is already initialized (i.e., reading has been started and has not yet
     * finished or been closed).
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

    close(): Promise<void> {
        if (!this.#reader) {
            throw new Error('Not an active reading process to close.');
        }

        const { reader, promise } = this.#reader;
        reader.close();
        return promise;
    }
}
