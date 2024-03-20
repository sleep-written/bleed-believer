export class CancelledExecution extends Error {
    constructor() {
        super('Execution was cancelled.');
    }
}