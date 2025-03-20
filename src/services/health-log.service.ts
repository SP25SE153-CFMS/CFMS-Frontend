import { HealthLog } from '@/utils/schemas/health-log.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/HealthLog';

export const getHealthLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<HealthLog[]>>(endpoint);
    return response.data.data;
};

export const getHealthLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<HealthLog>>(endpoint);
    return response.data.data;
};

export const createHealthLog = async (body: HealthLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateHealthLog = async (body: HealthLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteHealthLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
