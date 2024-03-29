# @bleed-believer/scheduler
A modern, efficient library designed for scheduling and executing tasks in Node.js applications based on time and day criteria, utilizing ESM for seamless integration with the contemporary JavaScript ecosystem.

## Features
-   __Flexible Scheduling:__ Define execution times for tasks with precision, specifying days of the week and times. Supports both specific schedules and continuous ('infinite') execution.
-   __Dynamic Configuration:__ Utilizes a YAML file for easy configuration and modifications of task schedules without needing to restart your application.
    Live Reload: Automatically detects changes in the configuration file and reloads task schedules on-the-fly, ensuring your tasks are always up-to-date.
-   __Versatile Task Definition:__ Implement tasks by extending a simple interface, allowing for a wide range of processes to be scheduled.
-   __Customizable Verbose Logging:__ Provides options for verbose logging directly or through custom callback functions, giving you insights into the scheduler's operations.
-   __Task Error Handling:__ Incorporates event hooks for handling errors within tasks, offering a mechanism to manage unexpected issues gracefully.
-   __Abort Mechanism:__ Enables the stopping of all scheduled and running tasks, providing a way to cleanly exit or reconfigure on the go.
-   __ESM Support:__ Designed with modern JavaScript projects in mind, supporting ECMAScript Modules (ESM) for integration with the latest Node.js features and syntax.

## Installation
Install the package via npm to easily incorporate it into your project:
```bash
npm install @bleed-believer/scheduler
```

This library is developed with and supports only ECMAScript Modules (ESM). Ensure your project is set up to use ESM.

## Getting Started
### Configuration
The library utilizes a YAML file to manage when tasks are executed. By default, the library watches `./scheduler.yml`, but you can specify a different path if desired. Define execution times using 'days' and 'timestamps' or opt for continuous execution with 'infinite'.

Example Configuration:
```yml
DailySummaryTask:
  - days: [1, 2, 3, 4, 5] # Monday to Friday
    timestamps:
      - [0, 0] # At 00:00:00 AM
      - [12, 0] # At 12:00:00 PM

AnotherTask: 'infinite' # Runs continuously
```

### Defining Tasks
A "task" refers to any process you wish to execute at predetermined times. Define a task by creating a class that implements the `Task` interface. Here's an example:
```ts
// File: ./src/tasks/daily-summary.task.ts
import type { Task } from '@bleed-believer/scheduler';

export class DailySummaryTask implements Task {
    async action(): Promise<void> {
        // Task implementation goes here
    }
}
```

### Initializing the Scheduler
#### With `Task` Array and Optional Verbose Flag
```ts
// File: ./src/start.js
import { Scheduler } from '@bleed-believer/scheduler';

import { DailySummaryTask } from './tasks/daily-summary.task.js';
import { AnotherTask } from './tasks/another.task.js';

const scheduler = new Scheduler([
    DailySummaryTask,
    AnotherTask
], true); // true for verbose logging
```

This initializes the scheduler with a specified array of tasks. The optional boolean flag enables verbose logging for insights into scheduler operations.

#### With `SchedulerOptions` Object
```ts
// File: ./src/start-with-options.js
import { Scheduler } from '@bleed-believer/scheduler';

import { DailySummaryTask } from './tasks/daily-summary.task.js';
import { AnotherTask } from './tasks/another.task.js';

const scheduler = new Scheduler({
    onConfigChanges:    (path) => console.log(`${path} changed.`),
    onAbortTasks:       () => console.log('Aborting tasks...'),
    onTaskError:        (error) => console.error('Task error:', error),
    configPath:         './custom-path/scheduler.yml',
    tasks: [
        DailySummaryTask,
        AnotherTask
    ]
});
```

When providing a SchedulerOptions object, you have the flexibility to:

-   Set custom paths for the configuration file (`configPath`).
-   Provide boolean values or custom callback functions for `onConfigChanges`, `onAbortTasks`, and `onTaskError` to handle scheduler events according to your needs.

### Scheduler Usage
Once initialized, use scheduler.execute() to start the task execution process. The scheduler will automatically listen for any changes in the configuration file and apply them without requiring a restart.

### Immediate Task Execution
In addition to scheduling tasks based on the YAML configuration, the `Scheduler` also provides a method to immediately execute tasks:
```ts
// Immediately executes a specific task by name, if provided
// If no name is specified, all tasks will be executed immediately
await scheduler.executeNow('SpecificTaskName');

// Alternatively, to execute all tasks immediately:
await scheduler.executeNow();
```

This feature is particularly useful for testing, manual invocation of tasks, or integrating task execution into other workflows where immediate action is required, bypassing the scheduler's timing mechanisms.

-   `executeNow(name?: string): Promise<void>`: Executes tasks immediately.
    -   `name`: Optional. The name of the task to execute. If omitted, all configured tasks are executed.
    -   Returns a `Promise<void>` that resolves once the specified tasks have been executed.

By utilizing `executeNow`, users gain additional flexibility in how and when tasks are executed, complementing the dynamic scheduling capabilities of the `@bleed-believer/scheduler` library. This method ensures that tasks can be run on-demand, providing an effective solution for scenarios requiring immediate action.

### Graceful Shutdown
Ensure to set up a listener for `SIGINT` to gracefully abort running tasks before starting the scheduler:
```ts
// This should be declared before starting the scheduler's execution
process.on('SIGINT', async () => scheduler.abort());

// Start executing the tasks as per the configuration
await scheduler.execute();
```

This approach allows your application to respond to `ctrl` + `c` commands in the terminal, ensuring that all tasks are aborted gracefully before the process exits. It's crucial to set up this listener before invoking `scheduler.execute()` to handle unexpected exits properly.

### Creating the Configuration File
To facilitate task management, the Scheduler provides two methods:

-   `generate()` without parameters: Automatically generates a default configuration file for all tasks specified during the scheduler's initialization.
    ```ts
    await scheduler.generate();
    ```

-   `generate(configuration)` with parameters: Allows you to programmatically specify the configuration. This method is especially useful for dynamically generated schedules or when the configuration is determined at runtime.
    ```ts
    await scheduler.generate({
        DailySummaryTask: 'infinite',   // Run continuously
        AnotherTask: [
            {
                days: [1, 2, 3, 4, 5],  // Weekdays
                timestamps: [
                    [ 0, 0, 0],     // At 00:00:00 AM
                    [12, 0, 0]      // At 12:00:00 AM
                ],
            },
        ],
    });
    ```

### Immediate Task Execution
The `executeNow` method provides the flexibility to execute tasks immediately, bypassing the scheduler's timing constraints. This feature is particularly useful for triggering specific tasks on demand, during debugging, or in response to external events. The method supports executing tasks in either serial or parallel modes, giving you control over task execution flow based on your application's needs.

To utilize `executeNow`, you must specify the execution mode (`ExecutionMode.Serial` or `ExecutionMode.Parallel`) and optionally, the names of the tasks to execute. If no task names are provided, the method attempts to execute all available tasks.

#### Example
```ts
import { Scheduler, ExecutionMode } from '@bleed-believer/scheduler';

import { SendEmailsTask } from './tasks/send-emails.task.js';
import { BackupDatabaseTask } from './tasks/backup-database.task.js';
import { CleanTempFilesTask } from './tasks/clean-temp-files.task.js';
import { GenerateReportsTask } from './tasks/generate-reports.task.js';

const scheduler = new Scheduler({
    tasks: [
        SendEmailsTask,
        BackupDatabaseTask,
        CleanTempFilesTask,
        GenerateReportsTask
    ]
});

// Execute specific tasks in serial mode
await scheduler.executeNow(ExecutionMode.Serial, 'BackupDatabaseTask', 'SendEmailsTask');

// Execute all tasks in parallel mode
await scheduler.executeNow(ExecutionMode.Parallel);
```

## Support and Contribution
This project supports only ESM, aligning with the Node.js ecosystem's direction. For issues, suggestions, or contributions, please refer to the project's GitHub repository.