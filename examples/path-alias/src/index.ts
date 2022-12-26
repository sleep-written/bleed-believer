import { launch } from '@tool/launch.js';
import { other } from './other.js';
// import { base } from '@base';

import { pathResolve } from '@bleed-believer/path-alias';

launch();
other();
// base();
console.log('path:', pathResolve('./joder.ts'));