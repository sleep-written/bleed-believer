/**
 * Helper method to determine if a specifier is a file URL.
 * 
 * @param specifier - The module specifier to check.
 * @returns A boolean indicating whether the specifier is a file URL.
 */
export function isFileUrl(specifier: string): boolean {
    try {
        const url = new URL(specifier);
        return url.protocol === 'file:';
    } catch {
        return false;
    }
}