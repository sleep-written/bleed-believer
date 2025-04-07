import type { ResponseInstance } from './response.instance.js';

export type FetchFunction = (url: string) => Promise<ResponseInstance>;