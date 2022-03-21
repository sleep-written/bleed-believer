export function normalizePath(path?: string): string | undefined {
    if (!path?.trim()?.length) {
        return undefined;
    } else {
        const v = path
            .replace(/\\+/gi, '/')
            .replace(/(^\/|\/$)/gi, '')
            .trim();

        return v.length ? v : undefined;
    }
}
