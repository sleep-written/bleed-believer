# Routing your commands

After created your command classes, you must attach those classes into the according routing class. Here's a basic example:

```ts
import { CommandRouting } from '@bleed-believer/commander';

// Importing the command classes
import { Task01Command } from './task01.commmand.js';
import { Task02Command } from './task02.commmand.js';
import { Task03Command } from './task03.commmand.js';

@CommandRouting({
    commands: [
        Task01Command,
        Task02Command,
        Task03Command,
    ]
})
export class AppRouting {}
```

<hr />

## Setting a `path`

You can set a path to the current routing class, that path assigned will be used has a prefix for the path of all commands attached to this routing class. For example:

```ts
import { CommandRouting } from '@bleed-believer/commander';

// Importing the command classes
import { Task01Command } from './task01.commmand.js'; // path: 'task01'
import { Task02Command } from './task02.commmand.js'; // path: 'task02'
import { Task03Command } from './task03.commmand.js'; // path: 'task03'

@CommandRouting({
    path: 'api',
    commands: [
        Task01Command,  // Now the path is: "api task01"
        Task02Command,  // Now the path is: "api task02"
        Task03Command,  // Now the path is: "api task03"
    ]
})
export class AppRouting {}
```

<hr />

## Nesting Routing classes

You can attach Routing classes inside to another Routing class. With this approach, combined with routing path assignment opens a wide variety of command hierarchy possibilities. For example:

```ts
import { CommandRouting } from '@bleed-believer/commander';

// Importing the command classes
import { Task01Command } from './task01.commmand.js';
import { Task02Command } from './task02.commmand.js';
import { Task03Command } from './task03.commmand.js';

// Another routings to attach
import { Nested01Routing } from './nested-01.routing.js';
import { Nested02Routing } from './nested-02.routing.js';
import { Nested03Routing } from './nested-03.routing.js';

@CommandRouting({
    path: 'api',
    commands: [
        Task01Command,
        Task02Command,
        Task03Command,
    ],
    routings: [
        Nested01Routing,
        Nested02Routing,
        Nested03Routing,
    ],
})
export class AppRouting {}
```

<hr />

## Routing Events

You can implement events to a Command Routing class. Only the events of those classes that traces the path to the found class will be fired. Lets check this hypothetical routing hierarchy for the next explanation of every event:

```bash
app.routing.ts
│   
├── level-1.routing.ts
│   │   
│   ├── level-11.routing.ts
│   ├── target-111command.ts
│   ├── target-112command.ts
│   │   
│   ├── level-12.routing.ts
│   ├── target-121command.ts
│   └── target-122command.ts
│   
└── level-2.routing.ts
    │   
    ├── level-21.routing.ts
    ├── target-211command.ts
    ├── target-212command.ts
    │   
    ├── level-22.routing.ts
    ├── target-221command.ts
    └── target-222command.ts
```

<hr />

### `BeforeCommand` event

This event is triggered before to execute the Command class. Using the hierarchy of above, if the command called is `target-122.command.ts` and all routes have the `BeforeCommand` event declared, the execution order is:
- `app.routing.ts`
- `level-1.routing.ts`
- `level-12.routing.ts`

To declare this event:
```ts
import { CommandRouting, BeforeCommand } from '@bleed-believer/commander';

import { Level1Routing } from './level-1.routing.js';
import { Level2Routing } from './level-2.routing.js';

@CommandRouting({
    commands: [
        Level1Routing,
        Level2Routing,
    ]
})
export class AppRouting implements BeforeCommand {
    before(): void {
        console.log('This will be executed before to the command!');
    }
}
```

<hr />

### `AfterCommand` event

This event is triggered after to execute and finished successful the Command class. Using the hierarchy of above, if the command called is `target-122.command.ts` and all routes have the `AfterCommand` event declared, the execution order is:
- `level-12.routing.ts`
- `level-1.routing.ts`
- `app.routing.ts`

To declare this event:
```ts
import { CommandRouting, AfterCommand } from '@bleed-believer/commander';

import { Level1Routing } from './level-1.routing.js';
import { Level2Routing } from './level-2.routing.js';

@CommandRouting({
    commands: [
        Level1Routing,
        Level2Routing,
    ]
})
export class AppRouting implements AfterCommand {
    after(): void {
        console.log('This will be executed after to the command!');
    }
}
```

<hr />

### `FailedCommand` event

This event is triggered after to execute the Command class and that class throws an error. Using the hierarchy of above, if the command called is `target-122.command.ts` and all routes have the `FailedCommand` event declared, the `Commander` instance will search the nearest event declared, and only execute the first result, in this order:
- `level-12.routing.ts`
- `level-1.routing.ts`
- `app.routing.ts`

To declare this event:
```ts
import { CommandRouting, FailedCommand } from '@bleed-believer/commander';

import { Level1Routing } from './level-1.routing.js';
import { Level2Routing } from './level-2.routing.js';

@CommandRouting({
    commands: [
        Level1Routing,
        Level2Routing,
    ]
})
export class AppRouting implements FailedCommand {
    failed(error: any): void {
        console.log('ERROR:');
        console.log(error?.message);
    }
}
```