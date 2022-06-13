export function leftReplacer(target: string, pattern: string, replacer: string): string {
    let i: number;
    for (i = 0; i < pattern.length; i++) {
        if (target[i] !== pattern[i]) {
            return target;
        }
    }

    return (replacer ?? '') + target.slice(i);
}