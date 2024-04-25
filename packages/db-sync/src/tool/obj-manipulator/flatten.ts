export type FlatObjectItem = { keys: (string | number | symbol)[], value: any; };

export function flatten(
    target: Record<string, any> | Record<string, any>[],
    mustBeParsed?: (v: any) => boolean
): FlatObjectItem[] {
    const out: FlatObjectItem[] = [];
    return flattenRecursive(target, out, [], mustBeParsed);
}

function flattenRecursive(
    target: Record<string, any> | Record<string, any>[],
    result: FlatObjectItem[],
    externalKeys: (string | number | symbol)[],
    mustBeParsed?: (v: any) => boolean
): FlatObjectItem[] {
    Object
        .entries(target)
        .forEach(([key, value]) => {
            const parsedKey = target instanceof Array ? parseInt(key) : key;
            const keys = [ ...externalKeys, parsedKey ];

            if (mustBeParsed && !mustBeParsed(value)) {
                // This must not be parsed
                result.push({
                    keys,
                    value
                });
            } else if (value && typeof value === 'object') {
                if (
                    (value instanceof Date) ||
                    (Buffer.isBuffer(value))
                ) {
                    // It's a date or a buffer
                    result.push({
                        keys,
                        value
                    });
                } else {
                    // Inner Object
                    flattenRecursive(
                        value,
                        result,
                        keys,
                        mustBeParsed
                    );
                }
            } else if (value != null) {
                // Simple Properties
                result.push({
                    keys,
                    value
                });
            }
        });

    return result;
}