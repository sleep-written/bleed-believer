# About Controllers

A controller is a class that represents a resource and implements endpoints in its methods. A controller can stores many endpoints as you want, and of course you can add any other methods to be called by the endpoint methods.

<br />

## Basic example

Using the example exposed [here](/docs/espresso/getting-started.md#folder-structure), the `user.controller.ts` file looks like this:
```ts
import { Get, Post, Patch, Controller } from '@bleed-believer/espresso';

export class UserController extends Controller {
    @Post('Login')
    async login(): Promise<void> {
        // Bla bla bla bla
    }
    
    @Get('Logout')
    async logout(): Promise<void> {
        // Bla bla bla bla
    }

    @Get(':id')
    async findOne(): Promise<void> {
        // Bla bla bla bla
    }

    @Patch()
    async save(): Promise<void> {
        // Bla bla bla bla
    }
}
```

If you see the code above, first you can notice that `UserController` extends the `Controller` class. With this we can access to the [Request](https://expressjs.com/es/4x/api.html#req) and [Response](https://expressjs.com/es/4x/api.html#res) objects provided by `express.js` when you normally declares an endpoint. For example:

```ts
import { Get, Controller } from '@bleed-believer/espresso';

export class TestController extends Controller {
    @Get()
    execute(): void {
        // Accessing to the Request object
        const headers = this.request.headers;

        // Accessing to the Response object
        this.response.json('Hello World'));
    }
}
```

Besides, the `@Get()` decorator above the `execute()` method tells to the library that this method is an endpoint using the `GET` method (more details [here](#http-method-decorators)). In order to declare a valid controller class, you must:
- Extend the abstract `Controller` class.
- Declare at least one endpoint.

<br />

## HTTP Method decorators

To declare an endpoint, you must decorate the method with an HTTP method decorator. Every decorator works the same way: if you don't provide a custom url, the url of that endpoint __will be the same as the path of the controller__, but if you provide a custom path, __this will be added after the controller path__. For example:

```ts
import { Get, Controller } from '@bleed-believer/espresso';

// According to the class name, the path of the controller is "/Test"
export class TestController extends Controller {
    // The path of this endpoint is "/Test" using the GET method.
    @Get()
    async find(): Promise<void> {
        // Bla bla bla bla
    }
    
    // The path of this endpoint is "/Test/:id" using the GET method.
    @Get(':id')
    async findById(): Promise<void> {
        // Bla bla bla bla
    }
    
    // The path of this endpoint is "/Test/Self" using the GET method.
    @Get('Self')
    async findSelf(): Promise<void> {
        // Bla bla bla bla
    }
}
```

The HTTP methods available are (according with [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)):

- `@Get()`:
    > The __`"GET"`__ method requests a representation of the specified resource. Requests using GET should only retrieve data.

    <br />

- `@Head()`:
    > The __`"HEAD"`__ method asks for a response identical to a GET request, but without the response body.

    <br />

- `@Post()`:
    > The __`"POST"`__ method submits an entity to the specified resource, often causing a change in state or side effects on the server.

    <br />

- `@Put()`:
    > The __`"PUT"`__ method replaces all current representations of the target resource with the request payload.

    <br />

- `@Delete()`:
    > The __`"DELETE"`__ method deletes the specified resource.

    <br />

- `@Connect()`:
    > The __`"CONNECT"`__ method establishes a tunnel to the server identified by the target resource.

    <br />

- `@Options()`:
    > The __`"OPTIONS"`__ method describes the communication options for the target resource.

    <br />

- `@Trace()`:
    > The __`"TRACE"`__ method performs a message loop-back test along the path to the target resource.

    <br />

- `@Patch()`:
    > The __`"PATCH"`__ method applies partial modifications to a resource.

    <br />

- `@All()`:
    > This method is, actually, __a shortcut__ to refer to all HTTP methods existents.

<br />

## Override the controller path

By default, the path of a controller class type is the name of the class without the `"Controller"` suffix. But if you need to change the path of the class, you can use the `@ControllerPath` decorator as follows:

```ts
import { Get, Controller, ControllerPath } from '@bleed-believer/espresso';

// Now with the decorator, the path of this controller class is "/TestAPI"
@ControllerPath('TestAPI')
export class TestController extends Controller {
    // The path of this endpoint is "/TestAPI" using the GET method.
    @Get()
    async find(): Promise<void> {
        // Bla bla bla bla
    }
    
    // The path of this endpoint is "/TestAPI/:id" using the GET method.
    @Get(':id')
    async findById(): Promise<void> {
        // Bla bla bla bla
    }
    
    // The path of this endpoint is "/TestAPI/Self" using the GET method.
    @Get('Self')
    async findSelf(): Promise<void> {
        // Bla bla bla bla
    }
}
```