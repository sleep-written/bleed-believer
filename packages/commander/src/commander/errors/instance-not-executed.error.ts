export class InstanceNotExecutedError extends Error {
    constructor() {
        super(
                'The commander instance must be executed (method '
            +   '"this.execute();") before to get parsed arguments.'
        );
    }
}