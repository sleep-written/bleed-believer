import type { CmdOptions, CmdResponse } from './interfaces/index.js';
import { spawn } from 'child_process';

export function cmd(command: string, options?: CmdOptions): Promise<CmdResponse>;
export function cmd(command: string, argv: string[], options?: CmdOptions): Promise<CmdResponse>;
export function cmd(...args:
    [string, CmdOptions?] |
    [string, string[], CmdOptions?]
): Promise<CmdResponse> {
    return new Promise((resolve, reject) => {
        const argv = args[1] instanceof Array ? args[1] : [];
        const proc = args[2]
            ?   spawn(args[0], argv, args[2])
            :   spawn(args[0], argv);
        
        const stdout: Buffer[] = [];
        const stderr: Buffer[] = [];

        proc.stdout?.on('data', chunk => stdout.push(chunk));
        proc.stderr?.on('data', chunk => stderr.push(chunk));
        proc.on('error', err => reject(err));
        proc.on('close', () => {
            const resp: CmdResponse = {};
            if (stdout.length > 0) {
                resp.stdout = Buffer.concat(stdout);
            }
            if (stderr.length > 0) {
                resp.stderr = Buffer.concat(stderr);
            }
            resolve(resp);
        });
    });
}