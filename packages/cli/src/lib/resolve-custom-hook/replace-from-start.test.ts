import test from 'ava';
import { replaceFromStart } from './replace-from-start.js';

test('target: "hola mundo", matcher: "hola", replacement: "se acerca el fin del"', t => {
    const result = replaceFromStart('hola mundo', 'hola', 'se acerca el fin del');
    t.is(result, 'se acerca el fin del mundo');
});

test('target: "hola mundo", matcher: "jaja", replacement: "se acerca el fin del"', t => {
    const result = replaceFromStart('hola mundo', 'jaja', 'se acerca el fin del');
    t.is(result, 'hola mundo');
});