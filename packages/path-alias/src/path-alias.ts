export class PathAlias {
    static SYMBOL = Symbol.for('@bleed-believer/path-alias');

    initialize(): void {
        const symbols = Object.getOwnPropertySymbols(process);
        if (!symbols.some(x => x === PathAlias.SYMBOL)) {
            (process as any)[PathAlias.SYMBOL] = false;
        }
    }

    markWithTsNode(): void {
        (process as any)[PathAlias.SYMBOL] = true;
    }

    isTsNode(): boolean {
        return (process as any)[PathAlias.SYMBOL] ?? false;
    }
}