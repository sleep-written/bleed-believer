import type { CommandRoutingClass } from '../command-routing/index.js';
import type { FlattenedCommand } from './interfaces/index.js';

import { COMMAND_ROUTING } from '../command-routing/index.js';
import { COMMAND } from '../command/index.js';

export function flattenRoute(base: CommandRoutingClass): FlattenedCommand[] {
    const baseMeta = COMMAND_ROUTING.get(base);
    const out: FlattenedCommand[] = [];

    // Iterate through the inner routes
    for (const inner of baseMeta.routings) {
        out.push(
            ...flattenRoute(inner).map(x => ({
                ...x,
                path: [...baseMeta.path, ...x.path],
                routings: [ base, ...x.routings ]
            }))
        );
    }

    // Flatten the commands of this route
    out.push(
        ...baseMeta.commands.map(x => {
            const meta = COMMAND.get(x);
            return {
                path: [ ...baseMeta.path, ...meta.path ],
                command: x,
                routings: [ base ]
            };
        })
    )

    return out;
}