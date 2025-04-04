import type { GetTsconfigFunction } from './get-tsconfig.function.js';
import type { StatSyncFunction } from './stat-sync.function.js';

export interface TsConfigFinderInjection {
    getTsconfig: GetTsconfigFunction;
    statSync: StatSyncFunction;
}
