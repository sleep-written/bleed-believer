import type { FileTranspilerInject, TSConfigObject } from './interfaces/index.js';
import type { Config, Options } from '@swc/core';
import type { DirentObject } from '@lib/ts-config/index.js';

import { basename, dirname, join, resolve, sep } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { ImportTransformer } from './import-transformer.js';
import { transform } from '@swc/core';

export class FileTranspiler {
    #importTransformer: ImportTransformer;
    #swcConfig: Config;
    #inject: Required<FileTranspilerInject>;

    #rootDir: string;
    #outDir: string;

    constructor(tsConfig: TSConfigObject, inject?: FileTranspilerInject) {
        this.#importTransformer = new ImportTransformer(tsConfig.value, inject);
        this.#swcConfig = tsConfig.toSWC();
        this.#inject = {
            process:    inject?.process                 ?? process,

            mkdir:      inject?.mkdir    ?.bind(inject) ?? mkdir,
            readFile:   inject?.readFile ?.bind(inject) ?? readFile,
            writeFile:  inject?.writeFile?.bind(inject) ?? writeFile,
            transform:  inject?.transform?.bind(inject) ?? transform
        };

        const cwd = this.#inject.process.cwd();
        this.#rootDir = resolve(cwd, tsConfig.value?.compilerOptions?.rootDir ?? '.');
        this.#outDir = resolve(cwd, tsConfig.value?.compilerOptions?.outDir ?? '.');
    }
    
    #getOutputPath(input: string | DirentObject): string {
        const file: DirentObject = typeof input === 'string'
        ?   { name: basename(input), parentPath: dirname(input), isFile: () => true }
        :   input;

        if (!(file.parentPath + sep).startsWith(this.#rootDir + sep)) {
            return typeof input !== 'string'
            ?   join(file.parentPath, file.name)
            :   input;
        }

        const parent = file.parentPath.slice(this.#rootDir.length + 1);
        const source = resolve(
            this.#outDir,
            parent,
            file.name
        );

        return source.replace(/(?<=\.(m|c)?)t(?=sx?$)/i, 'j');
    }

    async transpile(input: string | DirentObject): Promise<void> {
        const filePath = typeof input !== 'string'
        ?   join(input.parentPath, input.name)
        :   input;

        const file: DirentObject = typeof input === 'string'
        ?   { name: basename(input), parentPath: dirname(input), isFile: () => true }
        :   input

        const options: Options = structuredClone(this.#swcConfig);
        options.filename = filePath;
        delete options.exclude;

        const codePath = this.#getOutputPath(file);
        const mapPath = codePath + `.map`;

        const source = await this.#inject.readFile(options.filename, 'utf-8');
        const output = await this.#inject.transform(
            this.#importTransformer.transform(
                source,
                filePath
            ),
            options
        );

        const outputDir = dirname(codePath);
        await this.#inject.mkdir(outputDir, { recursive: true });
        await this.#inject.writeFile(codePath, output.code, 'utf-8');
        if (output.map) {
            const outputDirMap = dirname(codePath);
            await this.#inject.mkdir(outputDirMap, { recursive: true });
            await this.#inject.writeFile(mapPath, output.map, 'utf-8');
        }
    }
}