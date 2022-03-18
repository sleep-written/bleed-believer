import { MethodMeta } from '../methods';

export interface EndpointMeta {
    main: string;
    paths: MethodMeta[];
}