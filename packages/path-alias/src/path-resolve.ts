import { PathResolver } from './path-resolver.js';

const resolver = new PathResolver();
export function pathResolve(...input: string[]): string {
    return resolver.resolve(...input);
}