import { Args, ArgsParser } from '../tool/args-parser';

export class CommandNotFoundError extends Error {
    private _args: Args;
    /**
     * Gets the current arguments typed by the user.
     */
    public get args(): Args {
        return this._args;
    }

    constructor(args?: Args) {
        super();

        if (!args) {
            this._args = new ArgsParser();
        } else {
            this._args = args;
        }

        // Make message
        this.message = `The command "${this._args.toString()}" doesn't exists.`;
    }
}
