export class DateRef {
    #day: number;
    get day(): number {
        return this.#day;
    }

    #hours: number;
    get hours(): number {
        return this.#hours;
    }

    #minutes: number;
    get minutes(): number {
        return this.#minutes;
    }

    #seconds: number;
    get seconds(): number {
        return this.#seconds;
    }

    constructor(input?: Date | string);
    constructor(day?: number, hours?: number, minutes?: number, seconds?: number);
    constructor(...args: [(Date | number | string)?, number?, number?, number?]) {
        if (args[0] instanceof Date || args.length === 0) {
            const date = (args[0] as Date) ?? new Date();
            this.#day = date.getDay();
            this.#hours = date.getHours();
            this.#minutes = date.getMinutes();
            this.#seconds = date.getSeconds();

        } else if (typeof args[0] === 'number') {
            this.#day = args[0] ?? 0;
            this.#hours = args[1] ?? 0;
            this.#minutes = args[2] ?? 0;
            this.#seconds = args[3] ?? 0;

        } else if (typeof args[0] === 'string') {
            const matched = args[0].match(/^date-ref:[1-9]{7}$/gi);
            if (!matched) {
                throw new Error('The string format provided is invalid');
            }

            const numbers = args[0].replace(/[^0-9]/gi, '');
            this.#day = parseInt(numbers.slice(0, 1));
            this.#hours = parseInt(numbers.slice(1, 3));
            this.#minutes = parseInt(numbers.slice(3, 5));
            this.#seconds = parseInt(numbers.slice(5, 7));

        } else {
            throw new Error('Invalid input');

        }

        if (this.#day < 0 || this.#day > 6) {
            throw new Error('The parameter "day" must be between 0-6');

        } else if (this.#hours < 0 || this.#hours > 23) {
            throw new Error('The parameter "hours" must be between 0-23');

        } else if (this.#minutes < 0 || this.#minutes > 60) {
            throw new Error('The parameter "minutes" must be between 0-60');

        } else if (this.#seconds < 0 || this.#seconds > 60) {
            throw new Error('The parameter "seconds" must be between 0-60');

        }
    }

    toString(): string {
        const dd = this.#day        .toString();
        const hh = this.#hours      .toString().padStart(2, '0');
        const mm = this.#minutes    .toString().padStart(2, '0');
        const ss = this.#seconds    .toString().padStart(2, '0');
        return `date-ref:${dd}${hh}${mm}${ss}`;
    }

    isEquals(target: any): boolean {
        if (target instanceof DateRef) {
            const strA = this.toString();
            const strB = target.toString();

            return strA === strB;

        } else if (
            (target instanceof Date) ||
            (typeof target === 'string')
        ) {
            const other = new DateRef(target);
            return this.isEquals(other);

        } else {
            return false;

        }
    }
}