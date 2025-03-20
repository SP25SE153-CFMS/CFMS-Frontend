import { QuantityLog } from '@/utils/schemas/quantity-log.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/QuantityLog';

export const getQuantityLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<QuantityLog[]>>(endpoint);
    return response.data.data;
};

export const getQuantityLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<QuantityLog>>(endpoint);
    return response.data.data;
};

export const createQuantityLog = async (body: QuantityLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateQuantityLog = async (body: QuantityLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteQuantityLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
