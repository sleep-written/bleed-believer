import test from 'ava';
import { isPackageInstalled } from './is-package-installed.js';

test('should return true for an installed module (e.g., "tslog")', t => {
    const moduleName = 'tslog';
    const result = isPackageInstalled(moduleName);
    t.true(result, `"${moduleName}" should be installed`);
});

test('should return false for a non-installed module', t => {
    const moduleName = 'some-non-existent-module-xyz';
    const result = isPackageInstalled(moduleName);
    t.false(result, `"${moduleName}" should not be installed`);
});

test('should return true for a built-in Node.js module (e.g., "fs")', t => {
    const moduleName = 'fs';
    const result = isPackageInstalled(moduleName);
    t.true(result, `"${moduleName}" should be a built-in module and thus "installed"`);
});

test('should return true for an installed scoped module (if applicable)', t => {
    const moduleName = '@swc/core'; // Asegúrate de que este módulo esté instalado
    const result = isPackageInstalled(moduleName);
    t.true(result, `"${moduleName}" should be installed`);
});

test('should return true for an installed module subpath', t => {
    const moduleName = 'ts-node/esm'; // Ajusta según la estructura del paquete
    const result = isPackageInstalled(moduleName);
    t.true(result, `"${moduleName}" subpath should be resolvable if "ts-node" is installed`);
});