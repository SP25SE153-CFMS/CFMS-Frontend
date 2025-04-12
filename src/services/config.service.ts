import { SystemConfig } from '@/schemas/config.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Config';

export const getConfigs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<SystemConfig[]>>(endpoint);
    return response.data.data;
};

export const getConfigById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<SystemConfig>>(endpoint);
    return response.data.data;
};

export const createConfig = async (body: Omit<SystemConfig, 'systemConfigId'>) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateConfig = async (body: SystemConfig) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteConfig = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
