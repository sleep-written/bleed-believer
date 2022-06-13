import { Tsconfig } from './tsconfig/index.js';
import { addAlias } from 'module-alias';

const tsconfig = new Tsconfig();
const aliases = tsconfig.getAliases();

for (const item of aliases.resp) {
    addAlias(item.alias, item.path);
}
