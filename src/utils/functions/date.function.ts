import dayjs from 'dayjs';
import { capitalizeFirstLetter } from './string.function';
import { DATE_FORMAT } from '../constants/date.constant';

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

export function formatDate(dateStr: string | any, format = DATE_FORMAT) {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const formattedDate = dayjs(date).format(format);
    return capitalizeFirstLetter(formattedDate);
}

/**
 * Calculate the duration in days between start date and now
 *
 * @param startDate - The start date to calculate from
 * @param endDate - The end date to calculate to. If null, it will use the current date
 * @returns  {number} - The duration in days
 * @example
 * const duration = calculateDuration(new Date('2023-01-01'), new Date('2023-01-10'));
 * console.log(duration); // 9
 *
 * const duration = calculateDuration(new Date('2023-01-01'), null);
 * console.log(duration); // Number of days from 2023-01-01 to now
 */
export const calculateDuration = (startDate: Date, endDate: Date | null) => {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();
    return end.diff(start, 'day');
};

import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Extend the plugin and set the locale
dayjs.extend(relativeTime);
dayjs.locale('vi');

/**
 * Converts an ISO string to relative time in Vietnamese.
 * @param isoString A date string like '2025-04-24T02:34:25.071863'
 * @returns A string like '3 giờ trước'
 */
export function formatRelativeTime(isoString: string): string {
    return dayjs(isoString).fromNow(); // This works if plugin is extended!
}
