declare module "ts-node/esm" {
    import type {
        ResolveHook, LoadHook, ResolveFnOutput, ResolveHookContext,
        LoadFnOutput, LoadHookContext
    } from 'node:module';

    /**
     * El load hook incluido en ts-node.
     */
    export const load: LoadHook;

    /**
     * El loader que sigue en la cadena de ejecución.
     */
    export type NextLoad = (
        url: string,
        context?: LoadHookContext
    ) => LoadFnOutput | Promise<LoadFnOutput>;
    
    /**
     * El load hook incluido en ts-node.
     */
    export const resolve: ResolveHook;

    /**
     * El resolver que sigue en la cadena de ejecución.
     */
    export type NextResolver = (
        specifier: string,
        context?: ResolveHookContext
    ) => ResolveFnOutput | Promise<ResolveFnOutput>;
}