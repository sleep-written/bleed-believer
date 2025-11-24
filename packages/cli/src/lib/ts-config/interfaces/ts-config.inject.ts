import type { DirentObject } from './dirent.object.js';

export interface TSConfigInject {
    process?: {
        cwd(): string;
    };

    glob?(
        pattern: string | string[],
        options: {
            cwd: string;
            exclude?: string[];
            withFileTypes: true;
        }
    ): NodeJS.AsyncIterator<DirentObject>;
}