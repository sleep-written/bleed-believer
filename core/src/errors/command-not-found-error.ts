export class CommandNotFoundError extends Error {
    constructor() {
        super();

        // Concat arguments
        const args = process.argv.reduce((prev, curr, i) => {
            if (i > 0) {
                return `${prev} ${curr}`;
            } else {
                return curr;
            }
        });

        // Make message
        this.message = `The command "${args}" doesn't exists.`;
    }
}
