export interface DataSource<T extends Record<string, any>> {
    data: T[];
    total: number;
}