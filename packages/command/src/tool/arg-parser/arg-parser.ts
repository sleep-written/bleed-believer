import { ParserOptions, Argv } from './interfaces';

export class ArgParser implements Argv {
    static parseMain(input: string): string[] {
        const match = input.match(/(:|\.{3})?[a-z0-9\-_]+/gi);
        return match ?? [];
    }

    private _main: string[];
    get main(): string[] {
        return [ ...this._main ];
    }

    private _args: Record<string, string[]>;
    get args(): Record<string, string[]> {
        return { ...this._args };
    }

    private _options: ParserOptions;
    get options(): ParserOptions {
        return { ...this._options };
    }

    constructor(input: string[], options?: ParserOptions) {
        this._main = [];
        this._args = {};
        this._options = {
            linear:     options?.linear     ?? false,
            lowercase:  options?.lowercase  ?? false,
        }

        let key: string | null = null;
        for (const item of input) {
            if (item.match(/^-{1,2}[a-z0-9\-]*$/gi)) {
                // It's a key
                key = item
                    .replace(/^-{1,2}/gi, '--')
                    .trim();

                if (this._options.lowercase) {
                    key = key.toLowerCase();
                }                

                if (!this._args[key]) {
                    this._args[key] = [];
                }

            } else if (key) {
                // It's a value for a key
                this._args[key].push(item);

                if (!this._options.linear) {
                    key = null;
                }

            } else {
                // It's a main value
                this._main.push(item);

            }
        }
    }
}
