export function normalizePath(path?: string): string {
    if (typeof path !== 'string') {
        return '';
    } else {
        return path
            .replace(/\\+/gi, '/')
            .replace(/(^\/|\/$)/gi, '')
            .trim();
    }
}
