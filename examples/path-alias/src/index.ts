import { launch } from '@tool/launch.js';
import { other } from './other.js';
import { parse } from 'yaml';

launch();
other();

console.log('path:', './joder.ts');
console.log('yaml:', parse('- foo\n- bar'));