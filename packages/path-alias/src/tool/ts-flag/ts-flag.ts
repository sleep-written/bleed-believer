export class TsFlag {
    #isParsingSourceCode!: boolean;
    get isParsingSourceCode(): boolean {
        return this.#isParsingSourceCode;
    }

    markAsParsingSourceCode(): void {
        if (!this.#isParsingSourceCode) {
            this.#isParsingSourceCode = true;
        }
    }
}
