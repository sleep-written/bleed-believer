import { register } from 'node:module';

register('./loader/index.js', import.meta.url);