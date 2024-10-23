import type { TsConfigJson } from 'get-tsconfig';

const targetPaths: string[] = [
    'compilerOptions.target',
    'compilerOptions.module',
    'compilerOptions.moduleResolution',
];

/**
 * Normalizes the given TypeScript configuration object by converting specific compiler option values to lowercase.
 *
 * This function ensures that the values of `compilerOptions.target`, `compilerOptions.module`, and `compilerOptions.moduleResolution`
 * in the provided `tsConfig` are converted to lowercase strings. This normalization helps prevent case-sensitivity issues
 * when processing the `tsconfig.json` file.
 *
 * @param tsConfig - The TypeScript configuration object to normalize.
 * @returns A new TypeScript configuration object with normalized compiler option values.
 */
export function normalizeTsConfig(tsConfig: TsConfigJson): TsConfigJson {
    const out = structuredClone(tsConfig);
    for (const targetPath of targetPaths) {
        const [ name, ...path ] = targetPath.split('.').reverse();
        path.reverse();

        const parent = path.reduce<any>((prev, curr) => {
            if (!prev[curr]) { prev[curr] = {}; }
            return prev[curr];
        }, out);

        if (typeof parent[name] === 'string') {
            parent[name] = parent[name].toLowerCase();
        }
    }

    return out;
}
