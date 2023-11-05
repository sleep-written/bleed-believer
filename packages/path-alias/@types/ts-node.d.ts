declare module 'ts-node/esm' {
    export interface Context {
        conditions: string[],
        parentURL: string | undefined,
    }

    // export type ResolveFn = (
    //     specifier: string,
    //     context: Context,
    //     defaultResolve: ResolveFn
    // ) => Promise<{ url: string }>;

    export function load(
        url: string,
        context:  { format: string },
        defaultLoad: typeof load | Function
    ): any;

    export function resolve(
            specifier: string,
            context: Context,
            defaultResolve: typeof resolve | Function
        ): Promise<{ url: string }>;

    export function transformSource(): any;
}