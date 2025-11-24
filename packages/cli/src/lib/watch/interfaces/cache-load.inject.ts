import type { HashObject } from './hash.object.js';

export interface CacheLoadInject {
    readFile?(path: string): Promise<Buffer>;
    createHash?(algorithm: 'sha256' | 'sha512'): HashObject;
}