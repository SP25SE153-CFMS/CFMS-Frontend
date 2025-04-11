import { Request } from '@/utils/schemas/request.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { InventoryReceiptRequest } from '@/utils/types/custom.type';

const PREFIX = '/api/Request';

export const getRequests = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Request[]>>(endpoint);
    return response.data.data;
};

export const getRequestById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Request>>(endpoint);
    return response.data.data;
};

export const createRequest = async (body: Request) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateRequest = async (body: Request) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteRequest = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const createInvetoryReceiptFromRequest = async (body: InventoryReceiptRequest) => {
    const endpoint = PREFIX + '/create-inventory-receipt';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};
