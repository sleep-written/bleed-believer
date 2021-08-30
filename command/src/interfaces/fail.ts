/**
 * A generic function to handle errors inside the CommandRouter module.
 * This function can return `void` or a `Promise<void>`. For example:
 * ```ts
 * // A function that returns "void"
 * const fail01: Fail = (err: Error) => {
 *   console.error(err);
 *   process.exit(0);
 * };
 * 
 * // A function that returns "Promise<void>"
 * const fail02: Fail = async (err: Error) => {
 *   console.error(err);
 * 
 *   const connections = getConnections();
 *   for (const conn of connections) {
 *     await conn.close();
 *   }
 * 
 *   process.exit(0);
 * }
 * ```
 */
export type Fail = (err?: Error) => void | Promise<void>;
