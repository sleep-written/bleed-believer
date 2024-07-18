export class ObjectMutator<T extends Record<any, any> | any[]> {
    #value: T;
    get value(): T {
        return this.#value;
    }

    #parsePath(path: string): (string | number)[] {
        return Array.from(path
            .split('.')
            .map(x => {
                if (x.match(/^[0-9]*$/gi)) {
                    return parseInt(x);
                } else {
                    return x;
                }
            })
        );
    }

    constructor(value: T) {
        this.#value = value;
    }

    get<T = any>(path: string): T {
        let target: any = this.#value;
        const parsedPath = this.#parsePath(path);
        for (const prop of parsedPath) {
            if (target[prop] == null) {
                return target[prop];

            } else {
                target = target[prop];

            }
        }

        return target;
    }

    set(path: string, value: any): void {
        const parsedPath = this.#parsePath(path);
        if (parsedPath.length === 0) {
            return;
        }

        let target: any = this.#value;
        while (parsedPath.length > 0) {
            const prop = parsedPath.shift() as string | number;
            if (parsedPath.length === 0) {
                target[prop] = value;

            } else {
                if (target[prop] == null) {
                    if (typeof parsedPath.at(0) === 'number') {
                        target[prop] = [];

                    } else {
                        target[prop] = {};

                    }
                }

                target = target[prop];
            }
        }
    }
}