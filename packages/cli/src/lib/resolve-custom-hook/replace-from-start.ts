export function replaceFromStart(target: string, matcher: string, replacement: string): string {
    if (target.startsWith(matcher)) {
        return replacement + target.slice(matcher.length);
    } else {
        return target;
    }
}