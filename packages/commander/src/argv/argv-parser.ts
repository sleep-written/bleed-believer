import { ParserOptions, Argv, ArgvData } from './interfaces';

export class ArgvParser implements Argv {
    static parsePattern(input: string | string[]): string[] {
        if (input instanceof Array) {
            return input;
        } else {
            const match = input.match(/(:?[a-z0-9\-_]+|\.{3})/gi);
            return match ?? [];
        }
    }

    private _main: string[];
    get main(): string[] {
        return [ ...this._main ];
    }

    private _data: Record<string, string[]>;
    get data(): Record<string, string[]> {
        return { ...this._data };
    }

    private _options: Required<ParserOptions>;
    get options(): Required<ParserOptions> {
        return { ...this._options };
    }

    constructor(input: string[], options?: ParserOptions) {
        this._main = [];
        this._data = {};
        this._options = {
            linear:     options?.linear     ?? false,
            lowercase:  options?.lowercase  ?? false,
        }

        let key: string | null = null;
        for (const item of [...input]) {
            if (item.match(/^-{1,2}[a-z0-9\-]*$/gi)) {
                // It's a key
                key = item
                    .replace(/^-{1,2}/gi, '--')
                    .trim();

                if (this._options.lowercase) {
                    key = key.toLowerCase();
                }                

                if (!this._data[key]) {
                    this._data[key] = [];
                }

            } else if (key) {
                // It's a value for a key
                this._data[key].push(item);

                if (!this._options.linear) {
                    key = null;
                }

            } else {
                // It's a main value
                this._main.push(item);

            }
        }
    }

    match(pattern: string[]): ArgvData | null {
        const resp: ArgvData = {
            items: [],
            param: {},
        };

        for (let i = 0; i < pattern.length; i++) {
            const real = this._main[i];
            const patt = pattern[i];

            if (
                (patt === '...') &&
                (i === pattern.length - 1)
            ) {
                // Capture all the data of the end
                resp.items = this._main.slice(i);
            } else if (patt.startsWith(':')) {
                // Assign key/value parameters
                const key = patt.slice(1);
                resp.param[key] = real;
            } else if (this._options.lowercase) {
                // Permissive comparator
                const a = real?.toLowerCase();
                const b = patt?.toLowerCase();
                if (a !== b) {
                    return null;
                }
            } else if (real !== patt) {
                return null;
            }
        }

        return resp;
    }
}