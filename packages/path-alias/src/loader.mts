import { esm } from './esm.mjs';

export async function resolve(
    specifier: string,
    context:{
        conditions: string[],
        parentURL: string | undefined,
    },
    defaultResolve: Function
): Promise<Function> {
    specifier = esm.replace(specifier, context?.parentURL);

    // Defer to Node.js for all other specifiers.
    return defaultResolve(specifier, context, defaultResolve);
}