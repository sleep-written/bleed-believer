export interface GridView<T extends Record<string, any>> {
    data: T[];
    total: number;
}
