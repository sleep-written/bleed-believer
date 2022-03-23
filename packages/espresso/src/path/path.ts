export module Path {
    export function fromInstance(o: Object): string {
        return Path.fromClass(o.constructor);
    }

    export function fromClass(c: Function): string {
        const name = c.name;
        return '/' + name.replace(/Controller$/g, '');
    }

    export function normalize(path?: string): string | undefined {
        if (typeof path !== 'string') {
            return undefined;
        } else {
            const v = path
                .replace(/:+/gi, ':')
                .replace(/(\\|\/)+/gi, '/')
                .replace(/(^\/|\/$)/gi, '')
                .trim();
    
            return '/' + v;
        }
    }

    export function toLower(input: string): string {
        const chars = input.split('');
        if (input.startsWith('/')) {
            chars.shift();
        }

        let out = '';
        let hold = 0;
        for (const c of chars) {
            const l = c.toLowerCase();

            if (c !== l && out.length) {
                if (!hold) {
                    out += '-';
                }
                hold++;
            } else if (c === l) {
                if (hold > 1) {
                    out += '-';
                }
                hold = 0;
            }
            out += l;
        }

        if (input.startsWith('/')) {
            out = '/' + out;
        }

        return out;
    }
}
