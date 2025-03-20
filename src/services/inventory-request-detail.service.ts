import { InventoryRequestDetail } from '@/utils/schemas/inventory-request-detail.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/InventoryRequestDetail';

export const getInventoryRequestDetails = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<InventoryRequestDetail[]>>(endpoint);
    return response.data.data;
};

export const getInventoryRequestDetailById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<InventoryRequestDetail>>(endpoint);
    return response.data.data;
};

export const createInventoryRequestDetail = async (body: InventoryRequestDetail) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateInventoryRequestDetail = async (body: InventoryRequestDetail) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteInventoryRequestDetail = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
