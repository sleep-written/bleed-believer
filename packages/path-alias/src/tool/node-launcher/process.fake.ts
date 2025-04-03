import type { ProcessInstance } from './interfaces/process-instance.js';

export class ProcessFake implements ProcessInstance {
    cwd(): string {
        return '/path/to/dir';
    }
}