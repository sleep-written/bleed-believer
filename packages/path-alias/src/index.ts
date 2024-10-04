import { register } from 'module';

const parentURL = import.meta.url;
register('./custom-hooks.js', { parentURL });