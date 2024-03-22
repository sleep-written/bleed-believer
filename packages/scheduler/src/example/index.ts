import { Scheduler } from '../index.js';

import { timestamp } from './tool/timestamp.js';
import { Task01 } from './task-01.js';
import { Task02 } from './task-02.js';

const scheduler = new Scheduler([ Task01, Task02 ], true);

if (!await scheduler.configExists()) {
    // Generate a configuration file
    await scheduler.generate();
    timestamp('Configuration file generated');
} else {
    // Start the tasks
    await scheduler.execute();
    timestamp('All process ended sucessfully');
}