import { register } from "node:module";

const parentURL = import.meta.url;
register('./custom-hooks.js', { parentURL });
