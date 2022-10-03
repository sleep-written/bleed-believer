import { access, mkdir, rm, writeFile } from 'fs/promises';
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';

import { cmd } from '../cmd/index.js';

export async function realign(input: string): Promise<string> {
    // Create an available file
    const folder = join(tmpdir(), '@bleed-believer/mnt');
    await mkdir(folder, { recursive: true });

    // Build the path of the temp file
    let path: string = folder;
    while (true) {
        try {
            const rand = randomBytes(16).toString('hex');
            const name = `realign-${rand}.txt`;
            path = join(folder, name);

            // Test the path
            await access(path);
        } catch {
            // Found a name available
            break;
        }
    }

    // Normalize the input
    const content = input.trimEnd() + '\n';
    
    // Realign the input
    await writeFile(path, content);
    const resp = await cmd('column', ['-t', path]);
    if (resp.stderr) {
        const text = resp.stderr.toString('utf-8');
        throw new Error(text);
    }
    
    // Process the output
    await rm(path, { force: true });
    return resp.stdout?.toString('utf-8') ?? '';
}
