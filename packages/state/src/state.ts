import { Serial } from './serial/index.js';
import { Subject, BehaviorSubject } from 'rxjs';

export class State<T> {
    #serial = new Serial();
    #value: T;

    readonly context: Subject<T>;

    constructor(initial: T, emitAtInit?: boolean) {
        this.#value = initial;
        this.context =  emitAtInit
            ?   new BehaviorSubject<T>(initial)
            :   new Subject<T>();

        Object.defineProperty(this, 'context', {
            configurable: false,
            enumerable: false,
            writable: false,
        });
    }

    protected setContext(callback: (input: T) => T | Promise<T>): Promise<void> {
        return this.#serial.push(async () => {
            // Update the memory
            const newMemory = await callback(this.#value);
            this.#value = newMemory;
            this.context.next(this.#value);
        });
    }
}
