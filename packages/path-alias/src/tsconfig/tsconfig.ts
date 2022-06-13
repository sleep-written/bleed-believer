import { resolve } from 'path';

import { getCompilerOptions } from './get-compiler-options.js';
import { TsconfigAlias } from './interfaces/index.js';
import { leftReplacer } from '../tool/left-replacer.js';

export class Tsconfig {
    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path?: string) {
        this.#path = path ?? './tsconfig.json';
    }

    getAliases(isTsNode?: boolean): TsconfigAlias {
        const data = getCompilerOptions(this.#path, {});
        const rootDir = resolve(data.rootDir);
        const outDir = resolve(data.outDir);
        
        const resp: TsconfigAlias['resp'] = [];
        Object
            .keys(data.paths)
            .forEach(k => {
                const alias = k.replace(/(\\|\/)\*$/gi, '');
                data.paths[k]
                    .map(p => p.replace(/(\\|\/)\*$/gi, ''))
                    .map(p => isTsNode
                        ?   resolve(data.baseUrl, p)
                        :   leftReplacer(
                                resolve(data.baseUrl, p),
                                rootDir,
                                outDir
                            )
                    )
                    .forEach(p => {
                        resp.push({
                            alias,
                            path: p
                        });
                    });
            });

        return {
            resp,
            base: isTsNode
                ?   rootDir
                :   outDir,
        };
    }
}
