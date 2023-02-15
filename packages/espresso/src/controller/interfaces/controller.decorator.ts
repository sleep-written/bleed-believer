import type { ControllerClass } from './controller.class.js';

export type ControllerDecorator = (target: ControllerClass) => void;
