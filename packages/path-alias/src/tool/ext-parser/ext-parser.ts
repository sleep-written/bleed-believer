export class ExtParser {
    #input: string;

    constructor(input: string) {
        this.#input = input;
    }

    isFileUrl(): boolean {
        try {
            const url = new URL(this.#input);
            return url.protocol === 'file:';
        } catch {
            return false;
        }
    }

    isTs() {
        return !!this.#input.match(/(\.m?tsx?)$/gi);
    }

    isJs() {
        return !!this.#input.match(/(\.m?jsx?)$/gi);
    }

    toTs() {
        return this.#input.replace(/(?<=\.m?)j(?=sx?$)/gi, 't');
    }

    toJs() {
        return this.#input.replace(/(?<=\.m?)t(?=sx?$)/gi, 'j');
    }
}