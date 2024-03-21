import type { Action } from './action.js';
import { CancelledExecution } from './cancelled-execution.error.js';

export class TaskQueue {
    #runningPromise?: Promise<void>;
    #abortResolvers: (() => void)[] = [];
    #queue: {
        action: Action<any>;
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
    }[] = [];

    #currentIndex = 0; // Nuevo índice para rastrear la tarea actual

    async #runQueue(): Promise<void> {
        while (this.#currentIndex < this.#queue.length && this.#abortResolvers.length === 0) {
            const { action, resolve, reject } = this.#queue[this.#currentIndex];
            try {
                const resp = await action();
                resolve(resp);
            } catch (err) {   
                reject(err);
            }
            this.#currentIndex++; // Avanzar al siguiente ítem después de cada iteración
        }

        if (this.#abortResolvers.length > 0) {
            this.#queue
                .slice(this.#currentIndex)
                .forEach(({ reject }) => {
                    const err = new CancelledExecution();
                    reject(err);
                });

            this.#abortResolvers.forEach(x => x());
            this.#abortResolvers = [];
            this.#queue = [];
            this.#currentIndex = 0; // Reiniciar índice
        } else {
            // Si no se aborta, pero se terminan las tareas, preparar para nuevas tareas
            this.#queue = this.#queue.slice(this.#currentIndex);
            this.#currentIndex = 0; // Reiniciar índice para la nueva cola
        }

        this.#runningPromise = undefined;
    }

    run<T>(action: Action<T>): Promise<T> {
        const promise = new Promise<T>((resolve, reject) => {
            this.#queue.push({ action, resolve, reject });
        });

        if (!this.#runningPromise) {
            this.#runningPromise = this.#runQueue();
        }

        return promise;
    }

    abort(): Promise<void> {
        return new Promise<void>(resolve => {
            this.#abortResolvers.push(resolve);
        });
    }
}