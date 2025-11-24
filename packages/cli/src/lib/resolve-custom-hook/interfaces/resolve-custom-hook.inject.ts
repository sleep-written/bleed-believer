export interface ResolveCustomHookInject {
    process?: { cwd(): string; };
    access?:  (path: string) => Promise<void>;
}