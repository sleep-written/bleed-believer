import type { EventCallback, Observable, Subscription } from './interfaces/index.js';

export class EventSubscription<P extends any[]> implements Subscription {
    #observable: Observable<P>;
    #callback: EventCallback<P>;

    constructor(
        observable: Observable<P>,
        callback: EventCallback<P>
    ) {
        this.#observable = observable;
        this.#callback = callback;
    }

    unsubscribe(): void {
        this.#observable.off(this.#callback);
    }
}