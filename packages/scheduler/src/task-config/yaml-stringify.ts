import type { TaskLaunchOptions } from '../index.js';

export function yamlStringify(input: TaskLaunchOptions) {
    const header = `# TaskLauncher Configuration
# Define each task with a schedule or as 'infinite'.
# Schedules include an array of 'days' (0=Sunday, 6=Saturday)
# and 'timestamps' (hour, minute, second).
#
# Example:
#   myTask:
#     - days: [ 1, 2, 3, 4, 5 ] # Monday to Friday
#       timestamps:
#         - [ 9,   0 ]  # 9:00 AM
#         - [ 12,  0 ]  # Noon
#         - [ 15, 30 ]  # 3:30 PM
#
#     - days: [ 6, 0 ]    # Saturday and Sunday
#       timestamps:
#         - [ 10,  0 ]  # 10:00 AM
#
# To run a task indefinitely, use:
#   myOtherTask: 'infinite'
#

`;
    
    let out: string[] = [];
    Object
        .entries(input)
        .forEach(([ key, value ]) => {
            if (value === 'infinite') {
                out.push(`${key}: 'infinite'`);
            } else {
                let str = `${key}:\n`;
                for (const { days, timestamps } of value) {
                    str += `  - days: [ ${days.join(', ')} ]\n`;
                    str += `    timestamps:\n`;

                    for (const timestamp of timestamps) {
                        const tmp = timestamp
                            .filter(x => x != undefined)
                            .map((x) => x?.toString() ?? '')
                            .map(x => x.padStart(2, ' '));

                        str += `      - [ ${ tmp.join(', ') } ]\n`;
                    }

                    str += '\n';
                }

                out.push(str.trimEnd());
            }
        });

    return header + out.join('\n\n');
}