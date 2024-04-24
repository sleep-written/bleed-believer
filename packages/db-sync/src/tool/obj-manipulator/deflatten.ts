import type { FlatObjectItem } from './flatten.js';

export function deflatten<T extends Record<string, any> | Record<string, any>[]>(input: FlatObjectItem[]): T | null {
    if (input.length === 0) {
        return null;
    }

    let out: any = typeof input[0].keys[0] === 'number'
        ?   []
        :   {};

    for (const item of input) {
        let tmp: any = out;
        item.keys
            .forEach((k, i) => {
                if (i < item.keys.length - 1) {
                    if (tmp[k] == null) {
                        const kkk = item.keys[i + 1];
                        tmp[k] = typeof kkk === 'number'
                            ?   []
                            :   {};
                    }

                    tmp = tmp[k];
                } else {
                    tmp[k] = item.value;
                }
            });
    }

    return out;
}
