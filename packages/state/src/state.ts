import { BehaviorSubject, Subject } from 'rxjs';
import { Serial } from './serial.js';

/**
 * A class to create other classes as __State Manager__.
 * 
 * __How to use:__
 * - Create a service (using CLI: `npx ng g s path/to/the/service`)
 * - Extends that service class with this class (necesary if you wants to use
 * `BehaviorSubject<T>`).
 * - Declare a constructor and call to super to initialize this class.
 * 
 * If you call `super()` passing a value, the `this.state` property will
 * be a `BehaviorSubject<T>`, otherwise will be a `Subject<T>` instance.
 * The differences are:
 * - `BehaviorSubject<T>` will be initialized inmediatly emitting a value
 *   when the class is instantiated.
 * - `Subject<T>` waits for changes emitted manually by the developer.
 */
export class State<T> {
    #serial = new Serial();
    #value!: T;

    readonly state: Subject<T> | BehaviorSubject<T>;

    constructor(initial?: T) {
        if (initial != null) {
            this.#value = initial;
            this.state = new BehaviorSubject<T>(initial);
        } else {
            this.state = new Subject<T>();
        }

        Object.defineProperty(this, 'context', {
            configurable: false,
            enumerable: false,
            writable: false,
        });
    }

    protected setState(callback: (input: T) => T | Promise<T>): Promise<void> {
        return this.#serial.push(async () => {
            // Update the memory
            const newMemory = await callback(this.#value);
            this.#value = newMemory;
            this.state.next(this.#value);
        });
    }
}
