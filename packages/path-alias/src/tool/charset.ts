import { Char } from './char.js';

export class Charset {
    #chars: Char[];

    /**
     * Creates a new `Charset` inmutable instance.
     * @param input A string or an array of `Char` instances.
     */
    constructor(input: string | Char[]) {
        if (typeof input === 'string') {
            this.#chars = [];
            for (let i = 0; i < input.length; i++) {
                const char = new Char(input.charCodeAt(i));
                this.#chars.push(char);
            }
        } else {
            this.#chars = input;
        }
    }

    toString(): string {
        const charCodes = this.#chars.map(x => x.codePoint);
        return String.fromCodePoint(...charCodes);
    }

    /**
     * Replaces in the current instance a character of an specified position.
     * @param index The index of the character do you want to replace (base 0).
     * @param char A string with the new character to set,
     * or a number that represents the character code point,
     * or a `Char` instance.
     */
    replaceAt(index: number, char: string | number | Char, keepCasing?: boolean): Charset {
        const i = index < 0
            ?   this.#chars.length + Math.trunc(index)
            :   Math.trunc(index);

        const out = new Charset([ ...this.#chars ]);
        if (i >= 0 && i < this.#chars.length) {
            const charC = out.#chars[i];
            const charI = !(char instanceof Char)
                ?   new Char(char)
                :   char;

            if (keepCasing && charC.isAlphabet && charI.isAlphabet) {
                if (charC.isUpperCase && charI.isLowerCase) {
                    out.#chars[i] = charI.toUpperCase();
                } else if (charC.isLowerCase && charI.isUpperCase) {
                    out.#chars[i] = charI.toLowerCase();
                } else {
                    out.#chars[i] = charI;
                }
            } else {
                out.#chars[i] = charI;
            }
        }

        return out;
    }

    /**
     * Gets the according `Char` instance at the specified position.
     * @param index The zero-based index of the desired code unit.
     * A negative index will count back from the last item.
     */
    at(index: number): Char | undefined {
        return this.#chars.at(index);
    }

    map<T>(predicate: (o: Char, i: number) => T): T[] {
        return this.#chars.map(predicate);
    }
}