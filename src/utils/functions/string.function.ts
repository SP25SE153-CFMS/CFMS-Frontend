/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} string - The string to capitalize.
 * @returns {string} The input string with the first letter capitalized.
 *
 * @example
 * console.log(capitalizeFirstLetter('hello')); // 'Hello'
 */
export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
