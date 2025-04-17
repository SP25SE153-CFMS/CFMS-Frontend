/**
 * Generates a unique code based on the provided name and index.
 *
 * @param name - The name to generate the code from.
 * @param index - The index to start the code from (default is 1).
 * @returns A string representing the generated code.
 *
 * @example
 * console.log(generateCode("Green Valley Farm"));          // GVF001
 * console.log(generateCode("Khu nuôi gà lấy thịt"));       // KNGLT001
 * console.log(generateCode("Khu nuôi gà đẻ trứng"));       // KNGDT001
 */
export function generateCode(name: string, index: number = 1): string {
    // Clean up and split into words
    const cleaned = removeVietnameseTones(name).trim().replace(/\s+/g, ' ').toUpperCase();

    const words = cleaned.split(' ');

    // Get initials
    const initials = words.map((word) => word[0]).join('');

    // Format index with leading zeros
    const code = `${initials}${index.toString().padStart(3, '0')}`;

    return code;
}

// Remove Vietnamese accents
const removeVietnameseTones = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};
