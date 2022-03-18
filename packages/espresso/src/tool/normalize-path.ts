export function normalizePath(path?: string): string | undefined {
    if (!path?.trim()?.length) {
        return undefined;
    } else {
        return path
            .replace(/\\+/gi, '/')
            .replace(/(^\/|\/$)/gi, '')
            .trim();
    }
}
