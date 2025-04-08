import type { NodeJsProcessInstance } from './node-js-process.instance.js';
import type { AccessSyncFunction } from './access-sync.function.js';

export interface SwcTranspilerInjection {
    tsConfigPath: string;
    accessSync: AccessSyncFunction;
    process: NodeJsProcessInstance;
}