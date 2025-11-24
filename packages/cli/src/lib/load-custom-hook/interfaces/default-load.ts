import type { LoadFnOutput, LoadHookContext } from 'module';

export type DefaultLoad = (
    url: string,
    context?: LoadHookContext
) => LoadFnOutput | Promise<LoadFnOutput>;