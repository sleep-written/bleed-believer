import type { ResolveHookContext, ResolveFnOutput } from 'module';

export type DefaultResolve = (
    specifier: string,
    context?: ResolveHookContext
) => ResolveFnOutput | Promise<ResolveFnOutput>;