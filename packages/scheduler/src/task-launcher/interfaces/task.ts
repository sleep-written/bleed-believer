/**
 * Describes the functionality of a task that can be executed.
 */
export interface Task {
    /**
     * Executes the task's main action.
     * @returns A promise that resolves when the action has completed.
     */
    action(): Promise<void>;
}
