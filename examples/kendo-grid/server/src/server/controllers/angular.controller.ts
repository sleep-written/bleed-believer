import { Controller, ControllerPath, Get } from '@bleed-believer/espresso';
import { ServerCommand } from '../command.js';

@ControllerPath('*')
export class AngularController extends Controller {
    @Get()
    get(): void {
        this.response.sendFile('/', { root: ServerCommand.clientPath });
    }
}