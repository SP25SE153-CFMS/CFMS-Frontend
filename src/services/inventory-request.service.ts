import { InventoryRequest } from '@/utils/schemas/inventory-request.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/InventoryRequest';

export const getInventoryRequests = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<InventoryRequest[]>>(endpoint);
    return response.data.data;
};

export const getInventoryRequestById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<InventoryRequest>>(endpoint);
    return response.data.data;
};

export const createInventoryRequest = async (body: InventoryRequest) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateInventoryRequest = async (body: InventoryRequest) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteInventoryRequest = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
