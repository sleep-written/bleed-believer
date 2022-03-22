export * from './interfaces';

import { methodFactory } from './method-factory';

/**
 * A decorator to convert a class method into an endpoint of "GET" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Get        = methodFactory('get');

/**
 * A decorator to convert a class method into an endpoint of "HEAD" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Head       = methodFactory('head');

/**
 * A decorator to convert a class method into an endpoint of "POST" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Post       = methodFactory('post');

/**
 * A decorator to convert a class method into an endpoint of "PUT" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Put        = methodFactory('put');

/**
 * A decorator to convert a class method into an endpoint of "DELETE" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Delete     = methodFactory('delete');

/**
 * A decorator to convert a class method into an endpoint of "CONNECT" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Connect    = methodFactory('connect');

/**
 * A decorator to convert a class method into an endpoint of "OPTIONS" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Options    = methodFactory('options');

/**
 * A decorator to convert a class method into an endpoint of "TRACE" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Trace      = methodFactory('trace');

/**
 * A decorator to convert a class method into an endpoint of "PATCH" method.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Patch      = methodFactory('patch');
