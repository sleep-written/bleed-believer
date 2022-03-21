import { HttpMethods } from '../../interfaces';

export interface EndpointMeta {
    key: string | symbol;
    path?: string;
    method: keyof HttpMethods;
}
