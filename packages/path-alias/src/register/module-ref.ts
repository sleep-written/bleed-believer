export interface ModuleRef {
    id: string;
    path: string;
    exports: Record<string, any>;
    children: ModuleRef[];
    loaded: boolean;
}