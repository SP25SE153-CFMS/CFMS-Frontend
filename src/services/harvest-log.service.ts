import { HarvestLog } from '@/utils/schemas/harvest-log.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/HarvestLog';

export const getHarvestLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<HarvestLog[]>>(endpoint);
    return response.data.data;
};

export const getHarvestLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<HarvestLog>>(endpoint);
    return response.data.data;
};

export const createHarvestLog = async (body: HarvestLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateHarvestLog = async (body: HarvestLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteHarvestLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
