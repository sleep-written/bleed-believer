export class Chronometer {
    #timestamp?: Date;

    start(): void {
        if (this.#timestamp) {
            throw new Error('The Temporizer is already running, stop this current request before to make a new one');
        }

        this.#timestamp = new Date();
    }

    /**
     * Returns the seconds elapsed since `this.start()` was called.
     * @param presicion If this number is setled, the result will be aproximated
     * to this amount of decimals.
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
     * Returns the seconds elapsed since `this.start()` was called, and stops the temporizer.
     * After calling this method, you must call `this.start();` before to use `this.lap();` or
     * `tihs.stop():` again.
     * @param presicion If this number is setled, the result will be aproximated
     * to this amount of decimals.
     */
    stop(presicion?: number): number {
        const resp = this.lap(presicion);
        this.#timestamp = undefined;
        return resp;
    }
}