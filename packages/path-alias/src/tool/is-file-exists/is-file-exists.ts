import { access, constants } from 'fs/promises';

export async function isFileExists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
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