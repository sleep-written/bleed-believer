import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync, readFileSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

const isModuleInstalledCache = new Map<string, boolean>();
let packageJsonCache: { name: string } | undefined;

/**
 * Helper method to determine if a module is installed in node_modules.
 * 
 * @param moduleName - The name of the module to check.
 * @returns A boolean indicating whether the module is installed.
 */
export function isModuleInstalled(moduleName: string): boolean {
    if (moduleName.startsWith('@')) {
        moduleName = moduleName.replace(/(?<=@[^\/]+\/[^\/]+)\/.*$/gi, '');
    } else {
        moduleName = moduleName.replace(/\/.*$/gi, '');
    }

    if (isModuleInstalledCache.has(moduleName)) {
        return isModuleInstalledCache.get(moduleName)!;
    }

    // Get package.json of the current lib
    const currentPackageJsonPath = join(
        fileURLToPath(import.meta.url),
        '../../../../package.json'
    );

    // Load the current package.json
    packageJsonCache = JSON.parse(readFileSync(currentPackageJsonPath, 'utf-8'));
    if (packageJsonCache?.name === moduleName) {
        isModuleInstalledCache.set(moduleName, true);
        return true;
    }

    // Define the path to the package.json relative to the current file
    const packageJsonPath = join(process.cwd(), 'package.json');

    // Check if package.json exists at the defined path
    if (!existsSync(packageJsonPath)) {
        throw new Error(`'package.json' not found at path: ${packageJsonPath}`);
    }

    // Convert the package.json path to a URL compatible with createRequire
    const requirePath = pathToFileURL(packageJsonPath).href;

    // Create a require function based on the project's package.json location
    const requireFunc = createRequire(requirePath);

    try {
        // Attempt to resolve the module
        requireFunc.resolve(moduleName);
        isModuleInstalledCache.set(moduleName, true);
        return true;
    } catch (error: any) {
        if (
            error instanceof Error &&
            [
                'MODULE_NOT_FOUND',
                'ERR_PACKAGE_PATH_NOT_EXPORTED'
            ].some(x => x === (error as any).code)
        ) {
            isModuleInstalledCache.set(moduleName, false);
            return false;
        }

        // Re-throw unexpected errors
        throw error;
    }
}
