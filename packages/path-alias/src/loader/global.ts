import { LoaderHandler } from '../loader-handler.js';
import { Tsconfig } from '../tsconfig/index.js';

const options = new Tsconfig('./tsconfig.json').getOptions();
export const loaderHandler = new LoaderHandler(options);