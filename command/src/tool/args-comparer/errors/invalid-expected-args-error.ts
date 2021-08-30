export class InvalidExpectedArgsError extends Error {
    constructor();
    constructor(param: string);
    constructor(param: string, command: Function);
    constructor(param?: string, command?: Function) {
        super();

        if (param && command) {
            this.message = `The expected argument "${param}" declarated in the Command Class "${command.name}" is invalid`;
        } else if (param) {
            this.message = `The expected argument "${param}" declarated in the Command Class is invalid`;
        } else {
            this.message = `The expected argument declarated in the Command Class is invalid`;
        }
    }
}
