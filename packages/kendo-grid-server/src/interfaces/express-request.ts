import * as qs from 'qs';

export interface ExpressRequest {
    query: qs.ParsedQs;
}