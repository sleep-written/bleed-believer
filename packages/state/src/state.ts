import { BehaviorSubject } from 'rxjs';
import { Serial } from './serial.js';

/**
 * A class to create other classes as __State Manager__.
 * 
 * __How to use:__
 * - Create a class (if you are using `Angular`, we recommend create a service instead).
 * - Extends that class with this class.
 * - Declare a constructor, passing a initial state to the `super` (the parent's constructor).
 */
export class State<T> {
    #serial = new Serial();
    #value: T;

    readonly state: BehaviorSubject<T>;

    constructor(initial: T) {
        this.#value = initial;
        this.state =  new BehaviorSubject<T>(initial);

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
