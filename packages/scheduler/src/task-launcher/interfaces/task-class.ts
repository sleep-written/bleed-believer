import type { Task } from './task.js';

/**
 * Describes a class that implements the Task interface.
 * This interface is used for instantiating new tasks.
 */
export interface TaskClass {
    /**
     * Constructs a new instance of a task.
     * @returns A new Task instance.
     */
    new(): Task;
}
