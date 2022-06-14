import { resolve } from 'path';

import { TsconfigOpts } from './interfaces/index.js';
import { Json } from '../tool/json.js';

export function getCompilerOptions(
    path: string,
    input: Partial<TsconfigOpts>
): TsconfigOpts {
    const keys = ['baseUrl', 'rootDir', 'outDir', 'paths'];
    const json = new Json<any>(path).loadSync();

    const pending = keys
        .filter(k => !Object.keys(input).some(kk => k === kk))
        .filter(k => {
            const value = json?.compilerOptions?.[k];
            let empty = true;

            switch (k) {
                case 'paths': {
                    if (value && typeof value === 'object') {
                        input[k] = value;
                        empty = false;
                    } break;
                }
                default: {
                    if (typeof value === 'string') {
                        (input as any)[k] = value;
                        empty = false;
                    } break;
                }
            }

            return empty;
        });

    if (pending.length && typeof json.extends === 'string') {
        const newPath = resolve(path, '..', json.extends);
        return getCompilerOptions(newPath, input);
    } else {
        return input as any;
    }
}