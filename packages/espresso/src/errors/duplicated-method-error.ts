import { MethodMeta } from '../methods';

export class DuplicatedMethodError extends Error {
    constructor(meta?: MethodMeta, main?: string) {
        if (meta && main) {
            super(
                    `The path "${main}${(meta.path) ? `/${meta.path}` : ''}" `
                +   `with method "${meta.method.toUpperCase()}" is already registered `
                +   'in this Endpoint class.'
            );
        } else {
            super(
                    `The current path is already registered `
                +   'in this Endpoint class.'
            );
        }
    }
}