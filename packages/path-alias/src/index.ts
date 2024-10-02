import { register } from "node:module";
import { pathToFileURL } from "node:url";

const path = import.meta.resolve('./esm.js');
register(path, pathToFileURL("./"));
