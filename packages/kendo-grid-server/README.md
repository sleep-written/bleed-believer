# @bleed-believer/scheduler
A package to run code only at the days and hours that you need it. You can adjust which days and at which time to execute your different tasks using a `yaml` file. The package is available through npm:
```bash
npm i --save @bleed-believer/scheduler
```

## Disclaimer
Since __ESM__ hs been heavely adopted by the whole `node.js` community (including transpilers, unit testing, and many other libraries), the __CJS__ support has been removed. If you still needs the __CJS__ compatibility, please use [this version](https://www.npmjs.com/package/@bleed-believer/scheduler/v/0.2.0) or earlier.

## Usage
### About the Tasks
Every process do you want to execute in a certain moment will be called "task". To write a task, you must create a class that extends the `Task` abstract class, like this way:
```ts
// file: ./important-task.ts
import { Task } from '@bleed-believer/scheduler';

export class VeryImportantTask extends Task {
    async launch(): Promise<void> {
        // Here's the internal code of your task
        // Bla bla bla
        // Bla bla bla
        // Bla bla bla
    }
}
```
A valid descendant `Task` must have only 1 argument in Its constructor (a `Scheduler` instance). When a task must be executed, first the library creates a new independent instance of the `Task` descendant (in this case, a new instance of `VeryImportantTask`), and then, executes its `launch()` method.

### Generating configuration file
One of the objectives of this library is set when a task would be launched, using only one configuration file. To generate the file for all taks previously writted, you can use the `Scheduler` class, like this way:
```ts
// file: ./setup.ts
import { Scheduler } from '@bleed-believer/scheduler';

import { VeryImportantTask } from './very-important-task.js';
import { AnotherTask } from './another-task.js';

// Making the instance
const scheduler = new Scheduler([
    VeryImportantTask,
    AnotherTask
]);

// Creating the configuration file
await scheduler.createConfig();
```

### Launching the tasks
So, now if you want to run your tasks, according your configuration file, use the `Scheduler` class:
```ts
// file: ./start.ts
import { Scheduler } from '@bleed-believer/scheduler';

import { VeryImportantTask } from './very-important-task.js';
import { AnotherTask } from './another-task.js';

// Making the instance
const scheduler = new Scheduler([
    VeryImportantTask,
    AnotherTask
]);

// Launch the tasks
await scheduler.run();

// ...or if you need to lauch all tacks once
await scheduler.runNow();
```

### About the configuration file
The file generated with the method `Scheduler.createConfig()` is `./scheduler.yml` in the current working directory. The format of the generated file is like this:
```yaml
# This is the exact name of the Task class created before
VeryImportantTask:
    # Which days must be launched the task. The week starts with
    # sunday (value = 0) and ends with saturday (value = 6). In this
    # case will be executed from monday to friday
-   days: [ 1, 2, 3, 4, 5 ]

    # The time when the task must be launched, the format
    # is an array with [ hours, minutes, seconds ], and you
    # can omit the second or the minutes too
    timestamps:
        # Will be executed at 00:00:00
    -   [ 0 ]
        # Will be executed at 12:30:00
    -   [ 12, 30 ]
        # Will be executed at 14:45:30
    -   [ 14, 45, 30 ]

    # To be executed 
-   days: [ 6, 0 ]

    # If you set this property, the task will be in the time interval setled.
    # If you use this property, the other one "timestamps" will be ignore.
    # The format is an array like [ hours, minutes, seconds ].
    interval: [ 0, 30,  0]


# This is the exact name of the Task class created before
AnotherTask:
    # Which days must be launched the task. This will 
    # be executed in saturday and sunday
-   days: [ 6, 0 ]

    # The time when the task must be launched
    timestamps:
        # Will be executed at 08:30:00
    -   [ 8, 30 ]
```

## Extras
- To check if the configuration file exists:
    ```ts
    // file: ./start.ts
    import { Scheduler } from '@bleed-believer/scheduler';

    import { VeryImportantTask } from './very-important-task.js';
    import { AnotherTask } from './another-task.js';

    // Making the instance
    const scheduler = new Scheduler([
        VeryImportantTask,
        AnotherTask
    ]);

    // Returns a boolean
    const exists = await scheduler.exists();
    ```
    