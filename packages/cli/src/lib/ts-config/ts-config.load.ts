import type { TSConfigLoadInject, TsConfigValue } from './interfaces/index.js';

import { targetPathResolve } from './target-path-resolve.js';
import { tsConfigMerger } from './ts-config.merger.js';

import { dirname, resolve } from 'path';
import { access, readFile } from 'fs/promises';
import JSON5 from 'json5';

export async function tsConfigLoad(target?: string | null, inject?: TSConfigLoadInject): Promise<TsConfigValue> {
    const accessFn =   inject?.access   ?? access;
    const readFileFn = inject?.readFile ?? readFile;

    let tsConfig: TsConfigValue = {
        exclude: [ 'node_modules' ],
        compilerOptions: {
            target: 'esnext',
            module: 'nodenext',
            moduleResolution: 'nodenext'
        }
    };

    if (typeof target !== 'string') {
        target = targetPathResolve(target, inject);
        try {
            await accessFn(target);
        } catch (err: any) {
            return tsConfig;
        }
    } else {
        target = targetPathResolve(target, inject);
    }

    const jsonCache: string[] = [];
    const jsonPaths: string[] = [ target ];
    const jsonFiles: TsConfigValue[] = [];

    while (jsonPaths.length > 0) {
        const path = jsonPaths.shift()!;
        if (jsonCache.includes(path)) {
            throw new Error(`The path "${path}" was already readed`);
        } else {
            jsonCache.push(path);
        }

        const text = await readFileFn(path, 'utf-8');
        const json = JSON5.parse(text) as TsConfigValue;
        jsonFiles.push(json);

        if (json.extends instanceof Array) {
            json.extends
                .map(x => resolve(dirname(path), x))
                .forEach(x => { jsonPaths.push(x) });

        } else if (typeof json.extends === 'string') {
            const parent = resolve(dirname(path), json.extends);
            jsonPaths.push(parent);
        }
    }

    for (const json of jsonFiles.toReversed()) {
        tsConfig = tsConfigMerger.merge(json, tsConfig);
    }

    return tsConfig;
}