# Launch your application

After declaring your commands and your routes, you can initialize your application with the `Commander` class. The process is quite simple:

`./src/index.ts`
```ts
import { Commander } from '@bleed-believer/commander';
import { AppRouting } from './app.routing';

const app = new Commander(
    // The base route with all nested routes and commands
    AppRouting,

    // The commander options (optional)
    {
        linear: true,
        lowercase: true,
        chained: true
    }
);
app.execute();
```

The `Commander` class constructor has a 2nd optional argument. With that you can send options to the `Commander` class and change the routing behavior. The options available are:

- __linear__: (`boolean`, optional):
    > By default, the key (with format `--key`) gather only the value immediately next to it right. If you set the linear mode to `true`, all values placed to the right of the current key will be assigned to that key, until another key has been defined.

- __lowercase__: (`boolean`, optional):
    > If this value is `true`, all keys (with format `--key`) will be converted to lowercase before to be parsed. That allows to group values with case insensitive.

- __chained__: (`boolean`, optional):
    > By default, when you call the `execute()` method, __only the root route (the route given at the constructor) events will be called__, even if the command is not found. But if the `chained` mode is `true`, all routes through the found command will be captured, and their events called __only when the command is found.__
    >
    > More details about the events [here.](./command-routing.md#events)


