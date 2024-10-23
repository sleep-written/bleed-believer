export function normalize<T extends string>(
    input: T | null | undefined,
    values: T[],
    notFound?: (o: string) => T | null
): T | null {
    if (typeof input === 'string') {
        const map = Object.fromEntries(values.map(x => [
            x.toUpperCase(),
            x
        ]));

        const res = map[input.toUpperCase()];
        if (typeof res !== 'string') {
            return notFound
                ?   notFound(input)
                :   null;
        } else {
            return res;
        }
    } else {
        return null;
    }
}