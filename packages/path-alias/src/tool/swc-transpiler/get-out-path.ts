import type { TsConfigResult } from 'get-tsconfig';
import { dirname, resolve } from 'path';

export function getOutPath(path: string, tsConfigResult: TsConfigResult): string {
    let outPath = path;
    const cwd = dirname(tsConfigResult.path);
    const outDir = tsConfigResult.config.compilerOptions?.outDir;
    const rootDir = tsConfigResult.config.compilerOptions?.rootDir;
    const rootDirs = tsConfigResult.config.compilerOptions?.rootDirs;
    
    if (typeof outDir === 'string') {
        const rootDirsIndex = rootDirs
            ?.map(x => resolve(cwd, x))
            ?.findIndex(x => outPath.startsWith(x)) ?? -1;

        const outDirPath = resolve(cwd, outDir);
        const rootDirPath = typeof rootDir === 'string'
        ?   resolve(cwd, rootDir)
        :   undefined;

        if (rootDirsIndex >= 0) {
            const innerDir = rootDirs![rootDirsIndex];
            outPath = outPath.replace(
                resolve(cwd, innerDir),
                resolve(cwd, outDir, innerDir)
            );

        } else if (
            typeof rootDirPath === 'string' &&
            outPath.startsWith(rootDirPath)
        ) {
            outPath = outPath.replace(rootDirPath, outDirPath);

        }
    }

    return outPath.replace(/(?<=\.(m|c)?)t(?=s$)/gi, 'j');
}
