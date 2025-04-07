import type { NodeJsProcessInstance } from './node-js-process.instance.js';
import type { GetTsconfigFunction } from './get-tsconfig.function.js';
import type { StatSyncFunction } from './stat-sync.function.js';
import type { FetchFunction } from './fetch.function.js';

export interface GetTsConfigInjection {
    getTsconfig: GetTsconfigFunction;
    statSync: StatSyncFunction;
    process: NodeJsProcessInstance;
    fetch: FetchFunction;
}
