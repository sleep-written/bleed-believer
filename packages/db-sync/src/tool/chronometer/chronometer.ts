/**
 * Provides a simple chronometer utility for measuring elapsed time.
 * The chronometer can be started, stopped, and can record laps. It is useful for timing operations,
 * benchmarking code, or any scenario where time measurement is needed.
 * 
 * The chronometer maintains internal state to track the start time, and it supports calculating
 * elapsed time with optional precision for rounding results.
 */
export class Chronometer {
    #timestamp?: Date;

    /**
     * Starts the chronometer. If the chronometer is already running, it throws an error.
     * @throws {Error} if the chronometer is already running.
     */
    start(): void {
        if (this.#timestamp) {
            throw new Error('The Temporizer is already running, stop this current request before to make a new one');
        }

        this.#timestamp = new Date();
    }

    /**
     * Calculates the time elapsed since the chronometer was started, in seconds.
     * If a precision is provided, the result is rounded to the specified number of decimal places.
     * @param precision The number of decimal places to which to round the elapsed time.
     * @returns {number} The elapsed time in seconds, optionally rounded to the specified precision.
     * @throws {Error} if the chronometer has not been started yet.
     */
    lap(presicion?: number): number {
        if (!this.#timestamp) {
            throw new Error('You must call "this.start()" before to stop the Temporizer');
        }

        const past = this.#timestamp.getTime();
        const pres = new Date().getTime();
        const resp = (pres - past) / 1000;

        if (typeof presicion === 'number') {
            const lng = Math.abs(Math.trunc(presicion));
            const str = resp.toFixed(lng);
            return parseFloat(str);
        } else {
            return resp;
        }
    }

    /**
     * Stops the chronometer and returns the time elapsed since it was started, in seconds.
     * Optionally, the result can be rounded to a specified precision. After stopping, the chronometer
     * must be restarted before recording another lap or stopping again.
     * @param precision The number of decimal places to which to round the elapsed time.
     * @returns {number} The elapsed time in seconds, optionally rounded to the specified precision.
     */
    stop(presicion?: number): number {
        const resp = this.lap(presicion);
        this.#timestamp = undefined;
        return resp;
    }
}