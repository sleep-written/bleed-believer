import { COMMAND } from '../command/command';
import { CommandFlatted } from './interfaces';
import { COMMAND_ROUTING } from '../command-routing';
import { CommandRoutingClass } from '../interfaces';

export function commandFlatter(route: CommandRoutingClass): CommandFlatted[] {
    const mainMeta = COMMAND_ROUTING.get(route);
    const commands = mainMeta.commands
        .map(cmd => {
            const commMeta = COMMAND.get(cmd);
            return {
                main: [
                    ...mainMeta.main,
                    ...commMeta.main
                ],
                routes: [route],
                command: cmd
            }
        });

    for (const nestedRoute of mainMeta.routes) {
        commandFlatter(nestedRoute)
            .forEach(o => commands.push({
                main: [
                    ...mainMeta.main,
                    ...o.main
                ],
                routes: [
                    ...o.routes,
                    route
                ],
                command: o.command
            }));
        
    }

    return commands;
}