export function switchFn<T, V>(
    input: T,
    defaultValue: V | Error,
    ...valueCases: [T, V][]
): V {
    for (const [ switchCase, switchValue ] of valueCases) {
        if (input === switchCase) { return switchValue; }
    }

    if (defaultValue instanceof Error) {
        throw defaultValue;
    } else {
        return defaultValue;
    }
}