import { EmptyControllerError } from '../errors';
import { ControllerDecorator } from './interfaces';
import { CONTROLLER } from './controller';
import { Path } from '../path';

/**
 * Changes the path of a controller class.
 * @param path The new path to assign.
 */
export function ControllerPath(path: string): ControllerDecorator {
    return target => {
        if (!CONTROLLER.some(target)) {
            throw new EmptyControllerError();
        }

        // Normalize path
        const meta = CONTROLLER.get(target);
        const data = Path.normalize(path);

        // Set the new value
        meta.path = data;
        CONTROLLER.set(target, meta);
    }
}