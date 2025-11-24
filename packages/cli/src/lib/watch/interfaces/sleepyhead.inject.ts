export interface SleepyheadInject {
    date?: { now(): number; };
    setTimeout?(ms: number): Promise<void>;
}