import { Scheduler, ExecutionMode } from '../index.js';

import { timestamp } from './tool/timestamp.js';
import { Task01 } from './task-01.js';
import { Task02 } from './task-02.js';

const scheduler = new Scheduler([ Task01, Task02 ], true);
const nowIndex = process.argv.findIndex(x => /^-{1,2}now$/gi.test(x));
    
if (!await scheduler.configExists()) {
    // Generate a configuration file
    await scheduler.generate();
    timestamp('Configuration file generated');

} else if (nowIndex >= 0) {
    // Get task names
    const names = process.argv.slice(nowIndex + 1);

    // Start the tasks
    await scheduler.executeNow(ExecutionMode.Parallel, ...names);
    timestamp('All process ended sucessfully');

} else {
    // For gracefully abort
    process.on('SIGINT', () => {
        scheduler.abort();
    });

    // Start the tasks
    await scheduler.execute();
    timestamp('All process ended sucessfully');
}