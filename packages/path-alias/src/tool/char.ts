export class Char {
    #codePoint: number;
    get codePoint(): number {
        return this.#codePoint;
    }

    get isUpperCase(): boolean {
        return (this.#codePoint >= 65 && this.#codePoint <= 90);
    }

    get isLowerCase(): boolean {
        return (this.#codePoint >= 97 && this.#codePoint <= 122);
    }

    get isAlphabet(): boolean {
        return (this.isUpperCase || this.isLowerCase);
    }

    get isNumeric(): boolean {
        return (this.#codePoint >= 48 && this.#codePoint <= 57);
    }

    /**
     * Creates a new `Char` inmutable instance, using a string as input, or
     * a codePoint as number.
     * @param input An string with the character to instanciate,
     * or a number representing the character's codePoint.
     */
    constructor(input: string | number) {
        if (typeof input === 'string') {
            const codePoint = input.codePointAt(0);
            if (codePoint == null) {
                throw new Error('Cannot create a new instance using an empty string');
            } else {
                this.#codePoint = codePoint;
            }
        } else {
            this.#codePoint = input;
        }
    }

    toString(): string {
        return String.fromCodePoint(this.#codePoint);
    }

    /**
     * Creates a copy of the current instance in upper case.
     */
    toUpperCase(): Char {
        if (this.isLowerCase) {
            return new Char(this.#codePoint - 32);
        } else {
            return new Char(this.#codePoint);
        }
    }

    /**
     * Creates a copy of the current instance in lower case.
     */
    toLowerCase(): Char {
        if (this.isUpperCase) {
            return new Char(this.#codePoint + 32);
        } else {
            return new Char(this.#codePoint);
        }
    }
}