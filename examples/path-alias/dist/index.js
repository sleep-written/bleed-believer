import { launch } from "./tool/launch.js";
import { other } from "./other.js";
// import { base } from '@base';
import { pathResolver } from "@bleed-believer/path-alias";
launch();
other();
// base();
console.log('path:', pathResolver('./joder.ts'));

//# sourceMappingURL=index.js.map