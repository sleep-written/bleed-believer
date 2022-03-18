import { ENDPOINT } from './endpoint';
import { EndpointDecorator } from './endpoint.decorator';

export function EndpointPath(path: string): EndpointDecorator {
    return target => {
        const meta = ENDPOINT.get(target);
        ENDPOINT.set(target, {
            ...meta,
            main: path?.replace(/(^[\\\/]+|([\\\/]+)$)/gi, '')
        });
    };
}
