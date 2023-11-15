import { LoaderHandler } from './loader-handler.js';
import { Tsconfig } from './tsconfig/index.js';

const tsconfigPath = (process.env as any).TSCONFIG ?? './tsconfig.json';
export const options = new Tsconfig(tsconfigPath).getOptions();
export const loaderHandler = new LoaderHandler(options);