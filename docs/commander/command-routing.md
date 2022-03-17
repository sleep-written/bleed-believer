# Command Routing

This library __stores the command classes into routes__. A route is a class that uses the `@CommandRouting` decorator, and optionally implements the interfaces `BeforeCommand`, `AfterCommand` or `FailedCommand`. A Bleed-Believer application requires at least one route to store the CLI commands.

<br />

## Build a Route class

This is the most basic structure. In this example we created a route with 2 commands:

```ts
import { CommandRouting } from '@bleed-believer/commander';

// Command classes
import { SetupCommand } from './setup/setup.command';
import { StartCommand } from './start/start.command';

@CommandRouting({
    commands: [
        // main: [ 'setup' ]
        SetupCommand,
        // main: [ 'start' ]
        StartCommand
    ]
})
export class AppRouting { }
```

With this, for launch these commands, the execution arguments of every command are:
- `SetupCommand`:
    > node ./dist/index.js __setup__
- `StartCommand`:
    > node ./dist/index.js __start__

<br />

## Route with required arguments

You can set the required arguments for a whole route. For example, you need that all commands atached to the route of above needs `"app"` as required argument. For this case you must add the property `"main"` to the route options as follows:
```ts
import { CommandRouting } from '@bleed-believer/commander';

// Command classes
import { SetupCommand } from './setup/setup.command';
import { StartCommand } from './start/start.command';

@CommandRouting({
    main: [ 'app' ],
    commands: [
        // main: [ 'setup' ]
        SetupCommand,
        // main: [ 'start' ]
        StartCommand
    ]
})
export class AppRouting { }
```

Now, to resolve these commands you need this execution arguments:
- `SetupCommand`:
    > node ./dist/index.js __<u>app</u> setup__
- `StartCommand`:
    > node ./dist/index.js __<u>app</u> start__

<br />

## Nested routes

You can attach routes into another routes, this is specially useful when you have a lot of commands, and you want to group theses commands with a prefix. For example:

`./src/api/api.routing.ts`
```ts
import { CommandRouting } from '@bleed-believer/commander';

// Command classes
import { SetupCommand } from './setup/setup.command';
import { StartCommand } from './start/start.command';

@CommandRouting({
    main: 'api',
    commands: [
        SetupCommand,
        StartCommand
    ]
})
export class ApiRouting { }
```

`./src/bot/bot.routing.ts`
```ts
import { CommandRouting } from '@bleed-believer/commander';

// Command classes
import { SetupCommand } from './setup/setup.command';
import { StartCommand } from './start/start.command';

@CommandRouting({
    main: 'bot',
    commands: [
        SetupCommand,
        StartCommand
    ]
})
export class BotRouting { }
```

`./src/app.routing.ts`
```ts
import { CommandRouting } from '@bleed-believer/commander';

// Command classes
import { ApiRouting } from './api/api.routing.ts';
import { BotRouting } from './bot/bot.routing.ts';

@CommandRouting({
    routes: [
        ApiRouting,
        BotRouting
    ]
})
export class AppRouting { }
```
 With this case, to execute those commands, you have these execution arguments to use, respectly:
- > node ./dist/index.js __api setup__
- > node ./dist/index.js __api start__
- > node ./dist/index.js __bot setup__
- > node ./dist/index.js __bot start__

<br />

## Events and life cycle

Every route class emits events during its life cycle. All events are optional, and for the explanation of all events we will use this conceptual example:

```bash
# This is the root route
app.routing
│
│   # This is a nested route
├── nested-0.routing
│   │
│   │   # This is an another nested route
│   ├── nested-1.routing
│   │   ├── a1.command
│   │   └── b1.command
│   │
│   ├── a0.command
│   └── b0.command
│
├── a.command
└── b.command
```

<br />

### __`BeforeCommand`__

When the command requested exists, __all routes__ trigger this event <u>__before__</u> to execute the command. But if the command requested doesn't exists, __only the root route__ launches this event.
b
For example, if the command requested is `"a1.command"`, the `BeforeCommand` event will be triggered in these routes, in this order:
- `"app.routing"`
- `"nested-0.routing"`
- `"nested-1.routing"`

For other hand, if the command requested doesn't exists (using the above example), only the `"app.routing"` route will launches this event.

This is an example of how to declare this event in a route:
```ts
import { Argv, BeforeCommand, CommandRouting } from '@bleed-believer/commander';

// Command classes
import { ACommand } from './a.command.ts';
import { BCommand } from './b.command.ts';

@CommandRouting({
    commands: [
        ACommand,
        BCommand
    ]
})
export class AppRouting implements BeforeCommand {
    before(argv: Argv): void | Promise<void> {
        console.log('hello world');
    }
}
```
<br />

### __`AfterCommand`__

When the command requested exists, __all routes__ trigger this event <u>__after__</u> to execute the command. But if the command requested doesn't exists, __only the root route__ launches this event.

For example, if the command requested is `"a1.command"`, the `AfterCommand` event will be triggered in these routes, in this order (inverse):
- `"nested-1.routing"`
- `"nested-0.routing"`
- `"app.routing"`

For other hand, if the command requested doesn't exists (using the above example), only the `"app.routing"` route will launches this event.

This is an example of how to declare this event in a route:
```ts
import { Argv, AfterCommand, CommandRouting } from '@bleed-believer/commander';

// Command classes
import { ACommand } from './a.command.ts';
import { BCommand } from './b.command.ts';

@CommandRouting({
    commands: [
        ACommand,
        BCommand
    ]
})
export class AppRouting implements AfterCommand {
    after(argv: Argv): void | Promise<void> {
        console.log('bye world');
    }
}
```
<br />

### __`FailedCommand`__

If the command requested exists, __only the nearest route (with this event declared)__ triggers this event. Else if the command doesn't exists, the library will trigger this event at the root route passing an error (because the command isn't found) as argument. If a command throws an error, and none routes has a `FailedCommand` event declared, the error __will be propagated to the main node.js__ process. In all cases, when the error is catched (by the library or the top node process), the execution ends.

For example, you executed the `"a2.command"`, so the `Commander` instance will searches a route with this event declared, in this order:
- `"nested-1.routing"`
- `"nested-0.routing"`
- `"app.routing"`

If a route with this event declared is found, the error is catched by the route and triggers this event passing the error as argument.

This is an example of how to declare this event in a route:
```ts
import { FailedCommand, CommandRouting } from '@bleed-believer/commander';

// Command classes
import { ACommand } from './a.command.ts';
import { BCommand } from './b.command.ts';

@CommandRouting({
    commands: [
        ACommand,
        BCommand
    ]
})
export class AppRouting implements FailedCommand {
    failed(e: any): void | Promise<void> {
        console.error(e);
    }
}
```