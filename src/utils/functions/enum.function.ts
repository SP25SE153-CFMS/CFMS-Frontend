/**
 *  Maps an enum to an array of its values
 *
 * @param enumObj
 * @returns
 */
export function mapEnumToValues<T extends object>(enumObj: T): string[] {
    return Object.keys(enumObj)
        .filter((key) => !isNaN(Number(key))) // Filter numeric keys
        .map((key) => key); // Convert to string values
}
