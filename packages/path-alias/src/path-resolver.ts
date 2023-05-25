import { join, parse, format } from 'path';

import { TsconfigV2 } from './tsconfig/index.js';
import { isTsNode } from './is-ts-node.js';
import { Charset } from './tool/charset.js';

export class PathResolver {
    #outDir: string;
    #rootDir: string;
    #isTsNode: boolean;
    
    constructor();
    constructor(
        outDir: string,
        rootDir: string,
        isTsNode: boolean
    );
    constructor(...args: [] | [
        outDir: string,
        rootDir: string,
        isTsNode: boolean
    ]) {
        if (args.length === 0) {
            // Read from tsconfig
            const data = new TsconfigV2('./tsconfig.json').getOptions();
            this.#outDir = data.outDir;
            this.#rootDir = data.rootDir;
            this.#isTsNode = isTsNode();
        } else {
            // Path injection
            this.#outDir = args[0];
            this.#rootDir = args[1];
            this.#isTsNode = args[2];
        }
    }

    resolve(...pathParts: string[]): string {
        // Get the base path
        const basePath = this.#isTsNode
            ?   this.#rootDir
            :   this.#outDir;
6
        // Build the full path
        const fullPath = join(
            basePath,
            ...pathParts
        );
        
        // Process the extension
        const parsed = parse(fullPath);
        if (parsed.ext?.match(/^\.m?js$/gi) && this.#isTsNode) {
            parsed.ext = new Charset(parsed.ext)
                .replaceAt(-2, 't', true)
                .toString();

            parsed.base = parsed.name + parsed.ext;
        } else if (parsed.ext?.match(/^\.m?ts$/gi) && !this.#isTsNode) {
            parsed.ext = new Charset(parsed.ext)
                .replaceAt(-2, 'j', true)
                .toString();

            parsed.base = parsed.name + parsed.ext;
        }

        return format(parsed);
    }
}