import type { EventCallback, Observable } from './interfaces/index.js';
import { EventSubscription } from './event-subscription.js';

export class EventEmitter<P extends any[] = []> implements Observable<P> {
    #map = new Map<EventCallback<P>, boolean>();

    on(callback: EventCallback<P>): EventSubscription<P> {
        this.#map.set(callback, false);
        return new EventSubscription(this, callback);
    }

    once(callback: EventCallback<P>): EventSubscription<P> {
        this.#map.set(callback, true);
        return new EventSubscription(this, callback);
    }

    off(callback: EventCallback<P>): void {
        this.#map.delete(callback);
    }

    clear(): void {
        this.#map.clear();
    }

    toArray(): { callback: EventCallback<P>; once: boolean; }[] {
        return Array
            .from(this.#map)
            .map(([ callback, once ]) => ({ callback, once }));
    }

    emit(...args: P): void {
        for (const [ callback, once ] of this.#map) {
            try {
                if (once) {
                    this.off(callback);
                }

                const p = callback(...args);
                if (
                    p &&
                    typeof (p as any).then  === 'function' &&
                    typeof (p as any).catch === 'function'
                ) {
                    (p as Promise<unknown>).catch(err => console.error(err));
                }

            } catch (err) {
                console.error(err);

            }
        }
    }
}