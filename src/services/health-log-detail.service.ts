import { HealthLogDetail } from '@/utils/schemas/health-log-detail.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/HealthLogDetail';

export const getHealthLogDetails = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<HealthLogDetail[]>>(endpoint);
    return response.data.data;
};

export const getHealthLogDetailById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<HealthLogDetail>>(endpoint);
    return response.data.data;
};

export const createHealthLogDetail = async (body: HealthLogDetail) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateHealthLogDetail = async (body: HealthLogDetail) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteHealthLogDetail = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
