export * from './interfaces';

import { methodFactory } from './method-factory';

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"GET"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Get        = methodFactory('get');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"HEAD"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Head       = methodFactory('head');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"POST"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Post       = methodFactory('post');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"PUT"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Put        = methodFactory('put');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"DELETE"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Delete     = methodFactory('delete');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"CONNECT"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Connect    = methodFactory('connect');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"OPTIONS"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Options    = methodFactory('options');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"TRACE"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Trace      = methodFactory('trace');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"PATCH"__ method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Patch      = methodFactory('patch');
