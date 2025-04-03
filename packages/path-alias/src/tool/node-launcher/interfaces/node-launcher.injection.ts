import type { ProcessInstance } from './process-instance.js';
import type { SpawnFunction } from './spawn.function.js';

export interface NodeLauncherInjection {
    process: ProcessInstance;
    spawn: SpawnFunction;
}