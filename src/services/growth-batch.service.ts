import { GrowthBatch } from '@/utils/schemas/growth-batch.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/GrowthBatch';

export const getGrowthBatches = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<GrowthBatch[]>>(endpoint);
    return response.data.data;
};

export const getGrowthBatchById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<GrowthBatch>>(endpoint);
    return response.data.data;
};

export const createGrowthBatch = async (body: GrowthBatch) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateGrowthBatch = async (body: GrowthBatch) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteGrowthBatch = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
