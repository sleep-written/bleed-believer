export * from './interfaces/index.js';

import { methodFactory } from './method-factory.js';

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"GET"__ method:
 * 
 * The __`"GET"`__ method requests a representation of the specified resource. Requests using GET should only retrieve data.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Get        = methodFactory('get');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"HEAD"__ method:
 * 
 * The __`"HEAD"`__ method asks for a response identical to a GET request, but without the response body.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Head       = methodFactory('head');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"POST"__ method:
 * 
 * The __`"POST"`__ method submits an entity to the specified resource, often causing a change in state or side effects on the server.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Post       = methodFactory('post');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"PUT"__ method:
 * 
 * The __`"PUT"`__ method replaces all current representations of the target resource with the request payload.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Put        = methodFactory('put');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"DELETE"__ method:
 * 
 * The __`"DELETE"`__ method deletes the specified resource.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Delete     = methodFactory('delete');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"CONNECT"__ method:
 * 
 * The __`"CONNECT"`__ method establishes a tunnel to the server identified by the target resource.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Connect    = methodFactory('connect');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"OPTIONS"__ method:
 * 
 * The __`"OPTIONS"`__ method describes the communication options for the target resource.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Options    = methodFactory('options');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"TRACE"__ method:
 * 
 * The __`"TRACE"`__ method performs a message loop-back test along the path to the target resource.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Trace      = methodFactory('trace');

/**
 * A decorator to convert a `Controller` class method into an endpoint of __"PATCH"__ method:
 * 
 * The __`"PATCH"`__ method applies partial modifications to a resource.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const Patch      = methodFactory('patch');

/**
 * A decorator to convert a `Controller` class method into an endpoint with all existents methods:
 * 
 * This method is, actually, __a shortcut__ to refer to all HTTP methods existents.
 * @param path If this value is provided, the path of the endpoint will be settled
 * as a subroute of its `Controller` class.
 */
export const All        = methodFactory('all');
