import test from 'ava';
import { chunkUniqueElements } from './chunk-unique-elements.js';

// Test para verificar que maneja correctamente un array vacío.
test('Maneja array vacío', t => {
    const result = chunkUniqueElements([], 3);
    t.deepEqual(result, [], 'Un array vacío debe devolver un array vacío.');
});

// Test para verificar la eliminación de duplicados y correcta partición en chunks.
test('Elimina duplicados y crea chunks correctamente', t => {
    const inputArray = [1, 2, 3, 3, 4, 4, 5, 6];
    const chunkSize = 2;
    const expectedResult = [[1, 2], [3, 4], [5, 6]];
    const result = chunkUniqueElements(inputArray, chunkSize);
    t.deepEqual(result, expectedResult, 'Debe eliminar duplicados y particionar en chunks de tamaño 2.');
});

// Test para un caso con tamaño de chunk mayor que el número de elementos únicos.
test('Tamaño de chunk mayor que el número de elementos únicos', t => {
    const inputArray = [1, 2, 3, 3];
    const chunkSize = 5;
    const expectedResult = [[1, 2, 3]]; // Todos los elementos únicos caben en un solo chunk.
    const result = chunkUniqueElements(inputArray, chunkSize);
    t.deepEqual(result, expectedResult, 'Debe manejar correctamente un tamaño de chunk mayor que el número de elementos únicos.');
});

// Test para verificar el comportamiento con un tamaño de chunk de 1.
test('Tamaño de chunk igual a 1', t => {
    const inputArray = [1, 2, 2, 3];
    const chunkSize = 1;
    const expectedResult = [[1], [2], [3]]; // Cada elemento en su propio chunk.
    const result = chunkUniqueElements(inputArray, chunkSize);
    t.deepEqual(result, expectedResult, 'Debe crear un chunk por cada elemento único cuando el tamaño del chunk es 1.');
});

// Test para verificar que funciona con tipos de datos mixtos.
test('Funciona con tipos de datos mixtos', t => {
    const inputArray = [1, "2", "3", 3];
    const chunkSize = 2;
    const expectedResult = [[1, "2"], ["3", 3]]; // Mantiene tipos de datos mixtos.
    const result = chunkUniqueElements(inputArray, chunkSize);
    t.deepEqual(result, expectedResult, 'Debe manejar correctamente arrays con tipos de datos mixtos.');
});
