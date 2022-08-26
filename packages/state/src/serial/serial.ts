export class Serial {
    #busy = false;
    #queue: {
        resolve: () => void;
        reject: (e: any) => void;
        task: () => void | Promise<void>;
    }[] = [];

    /**
     * Gets the current status of this instance. Returns `true` when the
     * instance is executing pending tasks. Otherwise, if the instance
     * doesn't executing any tasks, returns `false`.
     */
    get isBusy(): boolean {
        return this.#busy;
    }

    /**
     * Gets the amount of pending tasks.
     */
    get pending(): number {
        return this.#queue.length;
    }

    async #execute(): Promise<void> {
        // Now the instance is busy
        this.#busy = true;

        while (this.pending) {
            // Gets the next pending task
            const target = this.#queue.shift();

            try {
                // Try to execute the task
                if (target) {
                    await target.task();
                    target.resolve();
                }
            } catch (err) {
                // Launch the error
                target &&
                target.reject(err);
            }
        }

        // Now the instance is free
        this.#busy = false;
    }

    /**
     * Adds a function to a queue of pending tasks. When the instance completes
     * the remaining tasks, then the current added task will be executed.
     * @param task The function do you want to execute by this instance.
     */
    push(task: () => void | Promise<void>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.#queue.push({ task, resolve, reject });
            
            if (!this.#busy) {
                this.#execute();
            }
        });
    }
}