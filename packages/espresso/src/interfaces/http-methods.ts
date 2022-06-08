export interface HttpMethods {
    /**
     * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
     */
    get: string;

    /**
     * The HEAD method asks for a response identical to a GET request, but without the response body.
     */
    head: string;

    /**
     * The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    post: string;

    /**
     * The PUT method replaces all current representations of the target resource with the request payload.
     */
    put: string;

    /**
     * The DELETE method deletes the specified resource.
     */
    delete: string;

    /**
     * The CONNECT method establishes a tunnel to the server identified by the target resource.
     */
    connect: string;

    /**
     * The OPTIONS method describes the communication options for the target resource.
     */
    options: string;

    /**
     * The TRACE method performs a message loop-back test along the path to the target resource.
     */
    trace: string;

    /**
     * The PATCH method applies partial modifications to a resource.
     */
    patch: string;

    /**
     * This method is, actually, a shortcut to refer to all HTTP methods existents.
     */
    all: string;
}