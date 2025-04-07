export interface ResponseInstance {
    ok: boolean;
    status: number;
    text(): Promise<string>;
}