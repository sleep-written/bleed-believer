import { Args } from "../tool/args/args";

export type Action = (args?: Args) => void | Promise<void>;
