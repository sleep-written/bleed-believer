import type { Options, Output } from '@swc/core';

export interface FileTranspilerInject {
    process?: { cwd(): string; };
    
    readFile?(path: string, encoding: 'utf-8'): Promise<string>;
    writeFile?(path: string, data: Buffer): Promise<void>;
    writeFile?(path: string, data: string, encoding: 'utf-8'): Promise<void>;
    transform?(source: string, options?: Options): Promise<Output>;
    mkdir?(path: string, options: { recursive: true }): Promise<string | undefined>;
}