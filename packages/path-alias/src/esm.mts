import { Tsconfig, TsconfigAlias } from './tsconfig/index.js';
import { leftReplacer } from './tool/left-replacer.js';
import { URL } from 'url';

export const esm = new class {
    #isTsNode: boolean;
    #aliases: TsconfigAlias;
    #symbol: symbol;


    constructor() {
        // Mark this process that this library is injected
        this.#symbol = Symbol('@bleed-believer/path-alias');
        (process as any)[this.#symbol] = true;

        // Check if we are using ts-node
        this.#isTsNode = Object
            .getOwnPropertySymbols(process)
            .some(x => x.description === 'ts-node.register.instance');

        // Get alias
        const tsconfig = new Tsconfig();
        this.#aliases = tsconfig.getAliases(this.#isTsNode);
    }

    replace(input: string, parentUrl?: string): string {
        // ParentURL is required
        if (typeof parentUrl !== 'string') {
            return input;
        }

        // Check if inside of...
        const root = this.#aliases.base;
        const path = new URL(parentUrl).pathname;

        if (path.startsWith(root)) {
            const found = this.#aliases.resp.find(x => input.startsWith(x.alias));
            if (found) {
                return leftReplacer(
                    input,
                    found.alias,
                    found.path
                );
            }
        }
        
        return input;
    }
}