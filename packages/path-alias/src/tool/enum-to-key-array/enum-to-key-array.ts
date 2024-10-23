/**
 * Converts an enumerable object (such as a TypeScript enum) into an array of its string keys,
 * properly handling heterogeneous enums.
 *
 * This function retrieves all the keys from the provided enumerable object and filters out any
 * keys that are numeric, ensuring that the returned array contains only the names of the enum members.
 *
 * @param enumarable - The enumerable object to convert (e.g., a TypeScript enum).
 * @returns An array of string keys from the enumerable object.
 *
 * @example
 * ```ts
 * enum HeterogeneousEnum {
 *     No = 0,
 *     Yes = "YES",
 *     Maybe = "MAYBE",
 *     Unknown = 3
 * }
 *
 * const enumKeys = enumToKeyArray(HeterogeneousEnum);
 * console.log(enumKeys); // Output: ['No', 'Yes', 'Maybe', 'Unknown']
 * ```
 */
export function enumToKeyArray(enumarable: any): string[] {
    return Object.keys(enumarable).filter(key => isNaN(Number(key)));
}
