import test from 'ava';
import { yamlStringify } from './yaml-stringify.js';

test('Case 01', t => {
    const target = yamlStringify({
        Task01: 'infinite',
        Task02: [
            {
                days: [ 1, 2, 3, 4, 5 ],
                timestamps: [
                    [  0, 0 ],
                    [  6, 0 ],
                    [ 12, 0 ],
                    [ 18, 0 ]
                ]
            },
            {
                days: [ 6, 0 ],
                timestamps: [
                    [  0, 0 ],
                    [ 12, 0 ]
                ]
            }
        ],
        Task03: 'infinite',
        Task04: [
            {
                days: [ 1, 2, 3, 4, 5 ],
                timestamps: [
                    [  0, 0 ],
                    [  6, 0 ],
                    [ 12, 0 ],
                    [ 18, 0 ]
                ]
            }
        ]
    });

    t.is(target,
`# TaskLauncher Configuration
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

Task01: 'infinite'

Task02:
  - days: [ 1, 2, 3, 4, 5 ]
    timestamps:
      - [  0,  0 ]
      - [  6,  0 ]
      - [ 12,  0 ]
      - [ 18,  0 ]

  - days: [ 6, 0 ]
    timestamps:
      - [  0,  0 ]
      - [ 12,  0 ]

Task03: 'infinite'

Task04:
  - days: [ 1, 2, 3, 4, 5 ]
    timestamps:
      - [  0,  0 ]
      - [  6,  0 ]
      - [ 12,  0 ]
      - [ 18,  0 ]`
    );
});