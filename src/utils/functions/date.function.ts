/**
 * Converts a numeric string representing a day of the week to its Vietnamese name.
 *
 * @param {string} value - A string from '0' to '6', where '0' is Sunday and '6' is Saturday.
 * @returns {string} The Vietnamese name of the weekday.
 *
 * @example
 * console.log(weekDayFormat('0')); // 'Chủ nhật'
 * console.log(weekDayFormat('3')); // 'Thứ tư'
 */
export function weekDayFormat(value: number) {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[value];
}