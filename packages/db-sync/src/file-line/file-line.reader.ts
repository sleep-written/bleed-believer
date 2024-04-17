import { ReadStream, createReadStream } from 'fs';
import { Interface, createInterface } from 'readline';
import { FileLine } from './file-line.js';

/**
 * Manages reading lines from a file asynchronously using a `ReadStream` and `Interface` from
 * Node.js's `readline` module.
 */
export class FileLineReader extends FileLine {
    #reader?: {
        readerStream: ReadStream;
        readerInterface: Interface;
        promise: Promise<void>;
    };

    /**
     * Indicates whether the `FileLineReader` instance is reading a file.
     * @returns {boolean} `true` if the reader is initialized, `false` otherwise.
     */
    get isReading(): boolean {
        return !!this.#reader;
    }

    #buildPromise(
        callback: (line: string, close: () => void) => void | Promise<void>,
        readerStream: ReadStream,
        readerInterface: Interface
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const handleClose = (error?: any) => {
                readerStream?.once('close', () => {
                    this.#reader = undefined;
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                readerInterface?.removeAllListeners();
                readerStream?.destroy();
            }

            const closeCallback = () => {
                readerInterface?.close();
            };

            readerInterface?.once('error', er => handleClose(er));
            readerInterface?.once('close', () => handleClose());
            readerInterface?.on('line', async line => {
                try {
                    await callback(line, closeCallback);
                } catch (err: any) {
                    readerInterface?.emit('error', err);
                }
            });
        });
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

        let promise: Promise<void> | undefined;
        let readerStream: ReadStream | undefined;
        let readerInterface: Interface | undefined;
        try {
            readerStream = createReadStream(this.path, {
                encoding: 'utf-8',
                autoClose: false,
                highWaterMark: 1024,
            });

            readerInterface = createInterface({
                crlfDelay: Infinity,
                terminal: false,
                input: readerStream
            });

            promise = this.#buildPromise(
                callback,
                readerStream,
                readerInterface
            );
            
            this.#reader = { readerStream, readerInterface, promise };
            return promise;
        } catch (err) {
            readerStream?.destroy();
            throw err;
        }
    }

    close(): Promise<void> {
        if (!this.#reader) {
            throw new Error('Not an active reading process to close.');
        }

        const { readerInterface, promise } = this.#reader;
        readerInterface.close();
        return promise;
    }
}
