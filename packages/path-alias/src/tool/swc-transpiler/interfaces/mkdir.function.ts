import type { MakeDirectoryOptions } from 'fs';

export type MkdirFunction = (
    path: string,
    options?: {
        recursive: true;
    }
) => Promise<string | undefined>;