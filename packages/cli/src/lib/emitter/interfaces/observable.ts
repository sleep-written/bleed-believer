import type { Subscription } from './unsubscribe.js';
import type { EventCallback } from './event-callback.js';

export interface Observable<P extends any[]> {
    on(callback: EventCallback<P>): Subscription;
    once(callback: EventCallback<P>): Subscription;
    off(callback: EventCallback<P>): void;
}