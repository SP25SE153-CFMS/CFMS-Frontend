/**
 * Formats a large number into a human-readable string with Vietnamese unit suffixes.
 * 
 * - "T" (Tỷ) for billions (≥ 1,000,000,000)
 * - "Tr" (Triệu) for millions (≥ 1,000,000)
 * - "N" (Nghìn) for thousands (≥ 1,000)
 * 
 * @param value - The number to format.
 * @param decimals - The number of decimal places to display (default is 1).
 * @returns A formatted string with the appropriate unit suffix.
 * 
 * @example
 * ```ts
 * formatLargeNumber(22545600);   // "22.5Tr"
 * formatLargeNumber(11500);      // "11.5N"
 * formatLargeNumber(1234567899); // "1.2T"
 * formatLargeNumber(1000000, 2); // "1.00Tr"
 * ```
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
    const units = [
        { threshold: 1_000_000_000, suffix: "T" },  // Tỷ
        { threshold: 1_000_000, suffix: "Tr" },     // Triệu
        { threshold: 1_000, suffix: "N" }          // Nghìn
    ];

    for (const unit of units) {
        if (value >= unit.threshold) {
            return (value / unit.threshold).toFixed(decimals) + unit.suffix;
        }
    }

    return value.toString(); // Return as-is if below 1,000
}

/**
 * Formats a number as Vietnamese currency (VND) with dot separators.
 * 
 * @param value - The number to format.
 * @returns A formatted string with dot separators and the "đ" suffix.
 * 
 * @example
 * ```ts
 * formatCurrency(22545000); // "22.545.000đ"
 * formatCurrency(1000000);  // "1.000.000đ"
 * formatCurrency(500);      // "500đ"
 * ```
 */
export function formatCurrency(value: number): string {
    return value.toLocaleString("vi-VN").replace(/,/g, ".") + "đ";
}