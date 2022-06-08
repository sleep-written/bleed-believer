import { EndpointMeta } from '../../endpoint/index.js';

export interface ControllerMeta {
    path?: string;
    endpoints: EndpointMeta[];
}
