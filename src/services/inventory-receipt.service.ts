import { InventoryReceipt } from '@/utils/schemas/inventory-receipt.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/InventoryReceipt';

export const getInventoryReceipts = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<InventoryReceipt[]>>(endpoint);
    return response.data.data;
};

export const getInventoryReceiptById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<InventoryReceipt>>(endpoint);
    return response.data.data;
};

export const createInventoryReceipt = async (body: InventoryReceipt) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateInventoryReceipt = async (body: InventoryReceipt) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteInventoryReceipt = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
