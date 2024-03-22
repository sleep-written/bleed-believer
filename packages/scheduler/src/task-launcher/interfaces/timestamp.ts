/**
 * Defines a timestamp for scheduling tasks.
 * The timestamp is represented as an array of three numbers corresponding to hours, minutes, and optional seconds.
 */
export type Timestamp = [ 
    number, // Hour (0-23)
    number?, // Minute (0-59)
    number? // Second (0-59)
];
