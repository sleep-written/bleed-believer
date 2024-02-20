import type { SortDescriptor } from '../interfaces/index.js';

export function stringifySort(s: SortDescriptor[]): string {
    const sort = s
        .filter(({ dir }) => {
            switch (dir) {
                case 'asc':
                case 'desc': {
                    return true;
                }
                default: {
                    return false;
                }
            }
        })
        .map(({ field, dir }) => `${field} ${dir ?? 'asc'}`)
        .join(',');

    return encodeURIComponent(sort);
}