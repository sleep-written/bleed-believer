import type { EncodingOption } from 'fs';

export type WriteFileFunction = (
    path: string,
    data: string | Buffer,
    options?: EncodingOption
) => Promise<void>;