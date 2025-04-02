export interface ProcessInstance {
    cwd(): string;
    argv: string[];
}