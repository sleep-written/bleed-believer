export function deepEqual(
    targetA: any,
    targetB: any,
): boolean {
    switch (true) {
        case (
            typeof targetA === 'undefined' ||
            typeof targetB === 'undefined'
        ):
        case (
            typeof targetA === 'function' ||
            typeof targetB === 'function'
        ):
        case (
            typeof targetA === 'boolean' ||
            typeof targetB === 'boolean'
        ):
        case (
            typeof targetA === 'bigint' ||
            typeof targetB === 'bigint'
        ):
        case (
            typeof targetA === 'number' ||
            typeof targetB === 'number'
        ):
        case (
            typeof targetA === 'symbol' ||
            typeof targetB === 'symbol'
        ):
        case (
            typeof targetA === 'string' ||
            typeof targetB === 'string'
        ):
        case (
            targetA === null ||
            targetB === null
        ): {
            return targetA === targetB;
        }

        case (
            targetA instanceof Array &&
            targetB instanceof Array
        ): {
            if (targetA.length !== targetB.length) {
                return false;
            }

            for (let i = 0; i < targetA.length; i++) {
                if (!deepEqual(targetA[i], targetB[i])) {
                    return false;
                }
            }

            return true;
        }

        default: {
            for (const key of Object.keys(targetA)) {
                if (!deepEqual(targetA[key], targetB[key])) {
                    return false;
                }
            }

            for (const key of Object.keys(targetB)) {
                if (!deepEqual(targetA[key], targetB[key])) {
                    return false;
                }
            }

            return true;
        }
    }
}