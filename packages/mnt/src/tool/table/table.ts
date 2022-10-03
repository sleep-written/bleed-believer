export function table<T extends Record<string, string>>(
    input: string
): T[] {
    const rows = input
        .trimEnd()
        .split(/\n+/gi);
    
    const cols = rows.shift()
        ?.match(/[a-z]+(\s+|$)/gi)
        ?.map(x => {
            const name = x.trimEnd();
            const length = x.length;
            if (name.length === 0) {
                throw new Error(`Invalid row, length must be greater than 0`);
            }

            return { name, length };
        }) ?? [];
        
    return rows.map(x => {
        const obj: any = {};

        let begin = 0;
        for (const col of cols) {
            const end = begin + col.length;
            const val = x
                .slice(begin, end)
                .trimEnd();

            obj[col.name] = val.trimEnd();
            begin = end;
        }

        return obj;
    });
}