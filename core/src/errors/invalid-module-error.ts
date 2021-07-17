export class InvalidModuleError extends Error {
    constructor();
    constructor(ref: new(...args: any) => any);
    constructor(ref?: new(...args: any) => any) {
        super();

        if (ref?.name) {
            this.message = `The class "${ref.name}" isn\'t a valid BleedModule.`;
        } else {
            this.message = `The class given isn\'t a valid BleedModule.`;
        }
    }
}