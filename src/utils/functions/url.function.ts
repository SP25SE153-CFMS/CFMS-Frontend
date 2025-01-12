/**
 * Checks if a given pathname represents a subpath.
 *
 * @param {string} pathname - The pathname to check.
 * @returns {boolean} `true` if the pathname has more than two segments; otherwise, `false`.
 *
 * @example
 * console.log(isSubPath('/home/user')); // false
 * console.log(isSubPath('/home/user/documents')); // true
 */
export function isSubPath(pathname: string): boolean {
    return pathname.split("/").length > 2;
}
