import test from 'ava';
import { isModuleInstalled } from './is-module-installed.js';

// Asegúrate de que 'tslog' esté instalado para esta prueba
test('should return true for an installed module (e.g., "tslog")', t => {
    const moduleName = 'tslog';
    const result = isModuleInstalled(moduleName);
    t.true(result, `"${moduleName}" should be installed`);
});

// Prueba con un módulo que no está instalado
test('should return false for a non-installed module', t => {
    const moduleName = 'some-non-existent-module-xyz';
    const result = isModuleInstalled(moduleName);
    t.false(result, `"${moduleName}" should not be installed`);
});

// Prueba con un módulo interno de Node.js
test('should return true for a built-in Node.js module (e.g., "fs")', t => {
    const moduleName = 'fs';
    const result = isModuleInstalled(moduleName);
    t.true(result, `"${moduleName}" should be a built-in module and thus "installed"`);
});

// Prueba con un paquete scoped
test('should return true for an installed scoped module (if applicable)', t => {
    const moduleName = '@swc/core'; // Asegúrate de que este módulo esté instalado
    const result = isModuleInstalled(moduleName);
    t.true(result, `"${moduleName}" should be installed`);
});

// Prueba con un módulo con subpath
test('should return true for an installed module subpath', t => {
    const moduleName = 'ts-node/esm'; // Ajusta según la estructura del paquete
    const result = isModuleInstalled(moduleName);
    t.true(result, `"${moduleName}" subpath should be resolvable if "ts-node" is installed`);
});
