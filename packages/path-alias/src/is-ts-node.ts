import { PathAlias } from './path-alias.js';

export function isTsNode(): boolean {
    return new PathAlias().isTsNode();
}