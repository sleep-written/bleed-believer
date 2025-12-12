import type { RegExpObject } from './interfaces/index.js';

export class RegExxx {
    static composite(
        patterns: (string | RegExpObject)[],
        callback: (str: string) => string,
        flags?: string
    ): RegExxx {
        const sources = patterns
            .map(x => typeof x !== 'string'
                ?   x.source
                :   x
            )
            .join('');

        const results = callback(sources);
        return new RegExxx(results, flags);
    }

    static parenthesis(
        patterns: (string | RegExpObject)[],
        callback?: (str: string) => string,
        flags?: string
    ): RegExxx {
        const sources = patterns
            .map(x => typeof x !== 'string'
                ?   x.source
                :   x
            )
            .join('|');

        const results = callback
        ?   callback(`(?:${sources})`)
        :   `(?:${sources})`;

        return new RegExxx(results, flags);
    }

    #flags: string;
    get flags(): string {
        return this.#flags;
    }

    #children: RegExxx[];
    get children(): RegExxx[] {
        return this.#children;
    }

    #source: string;
    get source(): string {
        if (this.#children.length > 0) {
            const sources = this.#children
                .map(x => x.source)
                .join('');

            return sources;
        } else {
            return this.#source;
        }
    }

    get debug(): string {
        if (this.#children.length > 0) {
            const parts = this.#children
                .map(x => '    ' + x.debug)
                .join(',\n');

            return `RegExxx([\n${parts}\n], "${this.#flags}")`;
        } else {
            return `RegExxx(/${this.#source}/${this.#flags})`;
        }
    }

    constructor(input: string | RegExpObject | (string | RegExpObject)[], flags?: string) {
        this.#children = [];
        if (Array.isArray(input)) {
            this.#source = '';
            this.#flags = flags ?? '';

            this.#children = input.map(x => {
                if (x instanceof RegExxx) {
                    return x;
                } else if (typeof x === 'string') {
                    return new RegExxx(x);
                } else {
                    return new RegExxx(x.source, x.flags);
                }
            });

        } else if (input instanceof RegExxx) {
            this.#children = input.children;
            this.#source = input.source;
            this.#flags = input.flags;

        } else if (typeof input !== 'string') {
            this.#source = input.source;
            this.#flags = flags ?? input.flags;

        } else {
            this.#source = input;
            this.#flags = flags ?? '';
        }
    }

    toRegExp(): RegExp {
        return new RegExp(this.source, this.flags);
    }
}