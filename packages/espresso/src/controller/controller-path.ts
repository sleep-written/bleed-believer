import type { ControllerDecorator } from './interfaces/index.js';

import { EmptyControllerError } from '../errors/index.js';
import { CONTROLLER } from './controller.js';
import { Path } from '../path/index.js';

/**
 * Changes the path of a controller class.
 * @param path The new path to assign.
 */
export function ControllerPath(path: string): ControllerDecorator {
    return target => {
        const meta = CONTROLLER.get(target, true);
        if (!meta) {
            throw new EmptyControllerError();
        }

        // Normalize path
        const data = Path.normalize(path);

        // Set the new value
        meta.path = data;
        CONTROLLER.set(target, meta);
    }
}