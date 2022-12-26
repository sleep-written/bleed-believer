import type { TsconfigOpts } from './tsconfig/index.js';

import { join, resolve } from 'path';

import { leftReplacer } from './tool/left-replacer.js';
import { PathAlias } from './path-alias.js';
import { Tsconfig } from './tsconfig/index.js';

let data: TsconfigOpts | undefined = undefined;
export function pathResolve(...input: string[]): string {
    console.log(Object.getOwnPropertySymbols(process));
    console.log((process as any)[PathAlias.SYMBOL]);

    if (!data) {
        data = new Tsconfig().getOptions();
        data.outDir = resolve(data.outDir);
        data.rootDir = resolve(data.rootDir);
        data.baseUrl = resolve(data.baseUrl);
    }

    let fullPath = join(data.outDir, ...input);
    let ext = fullPath.at(-2);

    const isTsNode = new PathAlias().isTsNode();
    if (isTsNode) {
        switch (ext) {
            case 'j':
                ext = 't';
                break;
            case 'J':
                ext = 'T';
                break;
        }

        fullPath = leftReplacer(
            fullPath,
            data.outDir,
            data.rootDir
        );
    } else {
        switch (ext) {
            case 't':
                ext = 'j';
                break;
            case 'T':
                ext = 'J';
                break;
        }
    }

    return fullPath.slice(0, -2) + ext + fullPath.slice(-1);
}