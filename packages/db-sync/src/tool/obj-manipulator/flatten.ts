export type FlatObjectItem = { keys: (string | number | symbol)[], value: any; };

export function flatten(
    target: Record<string, any> | Record<string, any>[],
    mustBeParsed?: (v: any) => boolean
): FlatObjectItem[] {
    const out: FlatObjectItem[] = [];
    if (!mustBeParsed) {
        mustBeParsed = () => true;
    }

    Object
        .entries(target)
        .forEach(([key, value]) => {
            const kkk = target instanceof Array
                ?   parseInt(key)
                :   key;

            if (!mustBeParsed(value)) {
                out.push({
                    keys: [kkk],
                    value
                });
            } else if (value && typeof value === 'object') {
                if (
                    (value instanceof Date) ||
                    (Buffer.isBuffer(value))
                ) {
                    // It's a date or a buffer
                    out.push({
                        keys: [kkk],
                        value
                    });
                } else {
                    // Inner Object
                    const inner = flatten(value, mustBeParsed);
                    inner.forEach(o => {
                        out.push({
                            keys: [kkk, ...o.keys],
                            value: o.value
                        });
                    });
                }
            } else if (value != null) {
                // Simple Properties
                out.push({
                    keys: [kkk],
                    value
                });
            }
        });

    return out;
}