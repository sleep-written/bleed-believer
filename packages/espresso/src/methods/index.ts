import { methodFactory } from './method-factory';

export { MethodMeta } from './method.meta';

export const Get = methodFactory('get');
export const Head = methodFactory('head');
export const Post = methodFactory('post');
export const Put = methodFactory('put');
export const Delete = methodFactory('delete');
export const Connect = methodFactory('connect');
export const Options = methodFactory('options');
export const Trace = methodFactory('trace');
export const Patch = methodFactory('patch');
