# Routing Injection

To set up your routes using `Espresso`, you'll need to create an `Espresso` instance and use it to register your route classes. Using the example described [here](/docs/espresso/getting-started.md#folder-structure), your `index.ts` file might look like this:

```ts
import { Espresso } from '@bleed-believer/espresso';
import { APIRouting } from './api.routing';

// Create a new Espresso instance with optional configuration
const espresso = new Espresso({ lowercase: false, verbose: false });

// Use your root "ControllerRouting" class to register all routes
espresso.use(APIRouting);

// Start your API server on port 8080
await espresso.listen(8080);
console.log('Server is ready!');
```

When using `Espresso`, you register your routing classes using the `.use()` method before starting the server with `.listen()`. This approach injects all routes defined in your controllers into the server's routing system.

## Order of Injection

`Espresso` processes routes in a hierarchical order, ensuring that more deeply nested routes are registered first. The general order of route injection is as follows:

1. **Nested routes**:
    1. **Further nested routes** (if any):
        1. The **controllers** associated with deeply nested routes.
    1. The **controllers** of the current nested route level.
1. The **controllers** of the root level routes.

This hierarchical approach ensures that routes are organized and injected into the server in an orderly manner, which helps maintain clarity and predictability in how requests are handled.

<br />

## Options

When creating a new `Espresso` instance, you can pass an optional configuration object to control how routes are injected:

- **lowercase** (`boolean`, optional):
  If set to `true`, all controller names and endpoints will be converted to lowercase. This is useful if you want consistent lowercase URLs without having to define them explicitly in each controller.
  > **Note**: If your `Controller` class name consists of multiple words (for example, `BleedBelieverController`), the path will be converted to `"bleed-believer"` using `"-"` as a separator when `lowercase` is `true`.

- **verbose** (`boolean`, optional):
  If set to `true`, all route injection processes will be logged to the terminal. This can be helpful for debugging and for verifying how the library processes and registers each route.

Example:

```ts
const espresso = new Espresso({
  lowercase: true,
  verbose: true
});
```

With these options, `Espresso` will log details about each route as it’s registered and convert all routes to lowercase paths.

<br />

## Error Handling

To handle errors thrown by your endpoints, you can use the `onError` method to register a custom error listener. For example:

```ts
import { Espresso } from '@bleed-believer/espresso';
import { APIRouting } from './api.routing';

const espresso = new Espresso();
espresso.use(APIRouting);

// Register a custom error handler
espresso.onError((err, res) => {
  res
    .status(err.status)
    .json({
        code: err.status,
        title: err.title,
        details: err.message
    });
});

// Start your API server on port 8080
await espresso.listen(8080);
console.log('Server is ready!');
```

In this example, if an endpoint throws an error, `Espresso` will pass that error to your custom error handler. The handler then responds with a JSON object containing the error code, title and message. If you do not define a custom error handler, `Espresso` will send a default HTML error response containing the error message.
