import { register } from 'node:module';
export { pathResolve } from './path-resolve.js';

register('./loader/index.js', import.meta.url);