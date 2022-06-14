declare module 'ts-node/esm' {
    export interface Context {
        conditions: string[],
        parentURL: string | undefined,
    }

    export type ResolveFn = (
        specifier: string,
        context: Context,
        defaultResolve: ResolveFn
    ) => Promise<{ url: string }>;

    export const resolve: ResolveFn;
    export function load(): any;
    export function transformSource(): any;
}