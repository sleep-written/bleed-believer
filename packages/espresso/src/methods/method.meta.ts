import { HttpMethods } from '../interfaces';

export interface MethodMeta {
    key: string | symbol;
    path: string;
    method: keyof HttpMethods;
}
