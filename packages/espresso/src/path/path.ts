export class Path {
    static fromInstance(o: Object): string {
        return Path.fromClass(o.constructor);
    }

    static fromClass(c: Function): string {
        const name = c.name;
        return '/' + name.replace(/Controller$/g, '');
    }

    static normalize(path?: string): string | undefined {
        if (typeof path !== 'string') {
            return undefined;
        } else if (path.trim().length) {
            const v = path
                .replace(/:+/gi, ':')
                .replace(/(\\|\/)+/gi, '/')
                .replace(/(^\/|\/$)/gi, '')
                .trim();
    
            return '/' + v;
        } else {
            return '';
        }
    }

    static toLower(input: string): string {
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
