import { Resource } from '@/utils/schemas/resource.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { ResourceResponse } from '@/utils/types/custom.type';

const PREFIX = '/api/Resource';

export const getResources = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<ResourceResponse[]>>(endpoint);
    return response.data.data;
};

export const getResourceById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ResourceResponse>>(endpoint);
    return response.data.data;
};

export const createResource = async (body: Resource) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateResource = async (body: Resource) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteResource = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
