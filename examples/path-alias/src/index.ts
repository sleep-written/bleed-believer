import { launch } from '@tool/launch.js';
import { other } from './other.js';
import { parse } from 'yaml';

import { pathResolve } from '@bleed-believer/path-alias';

launch();
other();

console.log('path:', pathResolve('./joder.ts'));
console.log('yaml:', parse('- foo\n- bar'));