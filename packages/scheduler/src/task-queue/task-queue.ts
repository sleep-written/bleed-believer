import type { Action } from './action.js';
import { CancelledExecution } from './cancelled-execution.error.js';

/**
 * Represents a queue for managing and executing actions sequentially.
 * Allows for the execution of asynchronous actions one after another,
 * providing mechanisms to add actions to the queue, run them, and
 * optionally abort all pending actions.
 */
export class TaskQueue {
    /**
     * A promise that represents the currently running action, if any.
     * Undefined if the queue is idle.
     * @private
     */
    #runningPromise?: Promise<void>;

    /**
     * An array of functions that, when called, resolve the abort promise.
     * @private
     */
    #abortResolvers: (() => void)[] = [];

    /**
     * The queue of actions to be executed. Each item in the queue
     * is an object containing the action to be executed and the resolve
     * and reject functions of the promise associated with the action.
     * @private
     */
    #queue: {
        action: Action<any>;
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
    }[] = [];

    /**
     * Runs the queue, executing each action in sequence until the queue is empty
     * or an abort has been requested. Handles the resolution and rejection
     * of action promises and clears the queue on abort.
     * @private
     */
    async #runQueue(): Promise<void> {
        while (this.#queue.length > 0 && this.#abortResolvers.length === 0) {
            const { action, resolve, reject } = this.#queue.shift()!;
            try {
                const resp = await action();
                resolve(resp);
            } catch (err) {   
                reject(err);
            }
        }

        if (this.#abortResolvers.length > 0) {
            // Empty the queue and abort resolvers in a memory-efficient manner
            this.#queue.forEach(({ reject }) => {
                const error = new CancelledExecution();
                reject(error);
            });

            this.#queue.length = 0;
            this.#abortResolvers.forEach(resolve => resolve());
            this.#abortResolvers.length = 0;
        }

        this.#runningPromise = undefined;
    }

    /**
     * Adds an action to the queue and starts the execution of the queue
     * if it is not already running. Returns a promise that resolves or rejects
     * with the result of the action.
     * @param {Action<T>} action The action to add to the queue.
     * @returns {Promise<T>} A promise that resolves or rejects with the result of the action.
     */
    run<T>(action: Action<T>): Promise<T> {
        const promise = new Promise<T>((resolve, reject) => {
            this.#queue.push({ action, resolve, reject });
        });

        if (!this.#runningPromise) {
            this.#runningPromise = this.#runQueue();
        }

        return promise;
    }

    /**
     * Requests the abortion of all pending actions in the queue. Each action's promise
     * will be rejected with a CancelledExecution error. Returns a promise that resolves
     * when all actions have been aborted.
     * @returns {Promise<void>} A promise that resolves when the abort process is complete.
     */
    abort(): Promise<void> {
        return new Promise<void>(resolve => {
            this.#abortResolvers.push(resolve);
            if (this.#runningPromise) {
                this.#runningPromise.then(() => {
                    // Ensure the queue is cleared and all abort resolvers are invoked
                    // after the current action finishes, improving the memory management.
                    this.#queue.length = 0;
                    this.#abortResolvers.forEach(resolveAbort => resolveAbort());
                    this.#abortResolvers.length = 0;
                });
            }
        });
    }
}
