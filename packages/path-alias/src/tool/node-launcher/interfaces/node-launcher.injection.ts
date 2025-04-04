import type { NodeJsProcessInstance } from './node-js-process.instance.js';
import type { SpawnFunction } from './spawn.function.js';

export interface NodeLauncherInjection {
    process: NodeJsProcessInstance;
    spawn: SpawnFunction;
}