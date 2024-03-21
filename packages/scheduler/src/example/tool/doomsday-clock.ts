export function doomsdayClock(ratio: number, message?: string): void {
    if (Math.random() <= ratio) {
        throw new Error(message ?? 'You died!');
    }
}