import type { TsconfigOpts } from './interfaces/index.js';

import { dirname, join, resolve } from 'path';
import { Json } from './json.js';

export function getCompilerOptions(
    path: string,
    input: Partial<TsconfigOpts>,
    extendsPath?: string
): TsconfigOpts {
    const keys = ['baseUrl', 'rootDir', 'outDir', 'paths'];
    const json = new Json(path).loadSync();
    const extendsNullishPath = extendsPath ?? '.';

    const pending = keys
        .filter(k => !Object.keys(input).some(kk => k === kk))
        .filter(k => {
            const value = (json?.compilerOptions as any)?.[k];
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
                        (input as any)[k] = join(extendsNullishPath, value);
                        empty = false;
                    } break;
                }
            }

            return empty;
        });

    if (pending.length > 0) {
        if (typeof json.extends === 'string') {
            const newPath = resolve(path, '..', json.extends);
            input = getCompilerOptions(newPath, input, join(
                extendsNullishPath,
                dirname(json.extends)
            ));
        } else if (json.extends instanceof Array) {
            for (const extendPath of json.extends) {
                const newPath = resolve(path, '..', extendPath);
                input = getCompilerOptions(newPath, input, join(
                    extendsNullishPath,
                    dirname(extendPath)
                ));
            }
        }
    }

    return input as any;
}
