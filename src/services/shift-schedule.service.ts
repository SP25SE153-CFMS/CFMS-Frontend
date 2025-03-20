import { ShiftSchedule } from '@/utils/schemas/shift-schedule.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/ShiftSchedule';

export const getShiftSchedules = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<ShiftSchedule[]>>(endpoint);
    return response.data.data;
};

export const getShiftScheduleById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ShiftSchedule>>(endpoint);
    return response.data.data;
};

export const createShiftSchedule = async (body: ShiftSchedule) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateShiftSchedule = async (body: ShiftSchedule) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteShiftSchedule = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
