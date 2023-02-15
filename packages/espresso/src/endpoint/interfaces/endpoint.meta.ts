import type { HttpMethods } from '../../interfaces/index.js';

export interface EndpointMeta {
    key: string | symbol;
    path?: string;
    method: keyof HttpMethods;
}
