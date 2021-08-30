import { Args } from '../args-parser';
import { InvalidExpectedArgsError } from './errors';

export class ArgsComparer {
    private _exp: Args;
    private _irl: Args;

    constructor(expected: Args, current: Args) {
        // Check expected values
        for (const item of expected.main) {
            const ok = !!item.match(/^(:|\.{3})?[a-z0-9\-_]+$/gi);
            if (!ok) {
                throw new InvalidExpectedArgsError(item);
            }
        }

        // Assign
        this._exp = expected;
        this._irl = current;
    }

    isSimilar(): boolean {
        // When the reference is empty
        if (this._exp.main.length === 0) {
            return this._exp.main.length === this._irl.main.length;
        }

        // Get both main
        const exp = this._exp.main.map(x => x.toLowerCase());
        const irl = this._irl.main.map(x => x.toLowerCase());

        if (exp.slice(-1)[0].match(/^\.{3}[a-z0-9\-_]+$/gi)) {
            // The last ...array
            exp.pop();
            let ok = true;
            for (let i = 0; i < exp.length; i++) {
                if (exp[i].match(/^:[a-z0-9\-_]+$/gi)) {
                    // Joker expression
                    ok = true;
                } else {
                    // Normal expression
                    ok = exp[i] === irl[i];
                    if (!ok) { break; }
                }
            }
            return ok;
        } else if (exp.length === irl.length) {
            // Equal length
            let ok = true;
            for (let i = 0; i < exp.length; i++) {
                if (exp[i].match(/^:[a-z0-9\-_]+$/gi)) {
                    // Joker expression
                    ok = true;
                } else {
                    // Normal expression
                    ok = exp[i] === irl[i];
                    if (!ok) { break; }
                }
            }
            return ok;
        } else {
            // Distinct length
            return false;
        }
    }
}