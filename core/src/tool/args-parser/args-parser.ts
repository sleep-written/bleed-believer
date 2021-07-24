import { Args, Parameters } from "./interfaces";

export class ArgsParser implements Args {
    private _param: Parameters;
    private _main: string[];
    public get main(): string[] {
        return this._main;
    }

    constructor(raw?: string[]) {
        // Use arguments from the current running process 
        if (!raw) {
            raw = process.argv;
            raw.splice(0, 2);
        }

        // Initialize internal variables
        this._main = [];
        this._param = {};

        // Iterate into the raw parameters
        let key: string;
        for (const item of raw) {
            if (item.match(/^-{1,2}[^\-]*$/gi)) {
                // This is the key param
                key = item
                    .replace(/^-{1,2}\s*/gi, '--')
                    .toLowerCase();

                if (!this._param[key]) {
                    this._param[key] = [];
                };

            } else if (key) {
                // This is the value of the key
                this._param[key].push(item);
                key = null;

            } else {
                // This is a main argument
                this._main.push(item);
            }
        }
    }

    find(key: string): string[] | null {
        // Build a valid key
        let ref = key;
        if (ref.match(/^-{1,2}[^\-]*$/gi)) {
            ref = ref
                .replace(/^-{1,2}\s*/gi, '--')
                .toLowerCase();

        } else {
            ref = ref
                .trimStart()
                .toLowerCase();
            ref = '--' + ref;
        }

        // Return the values
        return this._param[ref]?.map(x => x);
    }

    
}
