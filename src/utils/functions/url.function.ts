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
    return pathname.split('/').length > 2;
}

/**
 * The `convertToThumbnailUrl` function converts a Google Drive image URL to a thumbnail URL.
 *
 * @param imageUrl - The URL of the image to convert.
 * @description Converts a Google Drive image URL to a thumbnail URL.
 * This function checks if the provided URL contains 'drive.usercontent.google.com'.
 * If it does, it extracts the file ID from the URL and constructs a new thumbnail URL.
 * If the URL does not contain 'drive.usercontent.google.com', it returns the original URL.
 *
 * @returns {string} - The converted thumbnail URL or the original URL if no conversion is needed.
 *
 * @example
 * const thumbnailUrl = convertToThumbnailUrl('https://drive.usercontent.google.com/uc?id=12345');
 * console.log(thumbnailUrl); // Outputs: 'https://drive.google.com/thumbnail?id=12345&sz=w1000'
 *
 */
export function convertToThumbnailUrl(imageUrl: string): string {
    if (!imageUrl.includes('drive.usercontent.google.com')) {
        return imageUrl;
    }

    const match = imageUrl.match(/id=([^&]+)/);
    if (!match || !match[1]) {
        return imageUrl;
    }

    const fileId = match[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}
