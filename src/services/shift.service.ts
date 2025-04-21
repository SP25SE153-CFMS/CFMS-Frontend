import { Shift } from '@/utils/schemas/shift.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { getCookie } from 'cookies-next';
import config from '@/configs';

const PREFIX = '/api/Shift';

// export const getShifts = async () => {
//     const endpoint = PREFIX;
//     const response = await get<Response<Shift[]>>(endpoint);
//     return response.data.data;
// };

export const getShifts = async () => {
    const farmId = getCookie(config.cookies.farmId);
    const endpoint = `${PREFIX}/byFarmId/${farmId}`;
    const response = await get<Response<Shift[]>>(endpoint);
    return response.data.data;
};

export const getShiftById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Shift>>(endpoint);
    return response.data.data;
};

export const createShift = async (body: Shift) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateShift = async (body: Shift) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteShift = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
