import { EmptyControllerError, InvalidPathError } from '../errors';
import { ControllerDecorator } from './interfaces';
import { normalizePath } from '../tool';
import { CONTROLLER } from './controller';

export function ControllerPath(path: string): ControllerDecorator {
    return target => {
        if (!CONTROLLER.some(target)) {
            throw new EmptyControllerError();
        }

        // Normalize path
        const meta = CONTROLLER.get(target);
        const data = normalizePath(path);
        if (data == null) {
            throw new InvalidPathError();
        }

        // Set the new value
        meta.path = data;
        CONTROLLER.set(target, meta);
    }
}