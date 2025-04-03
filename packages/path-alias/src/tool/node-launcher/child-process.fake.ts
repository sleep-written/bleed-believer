import type { ChildProcessInstance } from './interfaces/index.js';

export class ChildProcessFake implements ChildProcessInstance {
    #events = new Map<string, ((...o: any[]) => void)[]>();

    on(event: 'close', callback: (___: any   ) => void): void;
    on(event: 'error', callback: (err: Error ) => void): void;
    on(event: string,  callback: (...o: any[]) => void): void {
        const callbacks = this.#events.get(event) ?? [];
        callbacks.push(callback);
        this.#events.set(event, callbacks);
    }

    invoke(event: 'close', params?:  any  ): void;
    invoke(event: 'error', params?:  Error): void;
    invoke(event: string, ...params: any[]): void {
        this.#events.get(event)?.map(x => x(...params));
    }
}