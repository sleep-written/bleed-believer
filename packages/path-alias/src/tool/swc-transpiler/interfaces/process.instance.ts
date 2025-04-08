export interface ProcessInstance {
    cwd(): string;
    platform: NodeJS.Process['platform'];
}