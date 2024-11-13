import { resolve, dirname } from 'path';
import { builtinModules, isBuiltin } from 'module';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Cache storage.
const cache = new Map<string, boolean>();

/**
 * Checks if a package is installed in the specified project.
 *
 * @param {string} packageName - The name of the package to check.
 * @param {string} [projectRoot] - The root directory of the project. If not provided, the function will attempt to determine the root.
 * @returns {boolean} - Returns true if the package is installed, or if it is a native Node module; otherwise, returns false.
 *
 * The function works as follows:
 * 1. It first checks if the result is cached to avoid redundant file system operations.
 * 2. If `projectRoot` is not provided, it will try to determine the appropriate project root by checking the current module's root,
 *    the mono repository root, and the current working directory.
 * 3. If the package is a native Node module, it returns true.
 * 4. The function cleans up the package name to handle scoped modules or internal paths.
 * 5. Finally, it checks the `dependencies` and `devDependencies` in the project's `package.json` to verify if the package is installed.
 */
export function isPackageInstalled(packageName: string, projectRoot?: string): boolean {
  if (isBuiltin(packageName)) {
    return true;
  }

  const cacheKey = `${packageName}|${projectRoot || 'default'}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  if (typeof projectRoot !== 'string') {
    const selfRoot = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../../..'
    );
    
    const exists = isPackageInstalled(packageName, selfRoot);
    if (exists) {
      cache.set(cacheKey, true);
      return true;
    }

    const monoRoot = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../../../../..'
    );
    
    const result = (
      isPackageInstalled(packageName, monoRoot) ||
      isPackageInstalled(packageName, process.cwd())
    );
    cache.set(cacheKey, result);
    return result;
  }

  // Check if the package is a native Node module
  if (builtinModules.includes(packageName)) {
    cache.set(cacheKey, true);
    return true;
  }

  // Clean up scoped or internal paths, e.g., @scope/package/subpath -> @scope/package
  const cleanedPackageName = packageName.split('/').length > 1 && packageName.startsWith('@')
    ? `${packageName.split('/')[0]}/${packageName.split('/')[1]}`
    : packageName.split('/')[0];

  try {
    // Resolve the path to the project's package.json
    const packageJsonPath = resolve(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Check dependencies and devDependencies for the package
    const result = (
      (packageJson.dependencies && packageJson.dependencies[cleanedPackageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[cleanedPackageName])
    ) != null;
    cache.set(cacheKey, result);
    return result;

  } catch (e) {
    cache.set(cacheKey, false);
    return false;

  }
}