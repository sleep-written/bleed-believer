export module Path {
    export function fromInstance(o: Object): string {
        return Path.fromClass(o.constructor);
    }

    export function fromClass(c: Function): string {
        const name = c.name;
        return '/' + name.replace(/Controller$/g, '');
    }

    export function normalize(path?: string): string | undefined {
        if (!path?.trim()?.length) {
            return undefined;
        } else {
            const v = path
                .replace(/:+/gi, ':')
                .replace(/(\\|\/)+/gi, '/')
                .replace(/(^\/|\/$)/gi, '')
                .trim();
    
            return v.length ? '/' + v : undefined;
        }
    }
}
