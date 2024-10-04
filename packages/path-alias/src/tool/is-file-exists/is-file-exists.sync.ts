import { accessSync } from 'fs';
import { constants } from 'fs/promises';

export function isFileExistsSync(path: string): boolean {
    try {
        accessSync(path, constants.F_OK);
        return true;
    } catch (err) {
        if (
            err instanceof Error &&
            (err as NodeJS.ErrnoException).code === 'ENOENT'
        ) {
            // File does not exist
            return false;
        }

        // Re-throw unexpected errors
        throw err;
    }
}