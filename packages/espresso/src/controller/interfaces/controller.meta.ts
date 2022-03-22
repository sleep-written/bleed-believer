import { EndpointMeta } from '../../endpoint';

export interface ControllerMeta {
    path?: string;
    endpoints: EndpointMeta[];
}
