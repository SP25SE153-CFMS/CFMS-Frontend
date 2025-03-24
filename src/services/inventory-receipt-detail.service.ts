import { InventoryReceiptDetail } from '@/utils/schemas/inventory-receipt-detail.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { inventoryReceiptDetails } from '@/utils/data/table.data';

const PREFIX = '/api/InventoryReceiptDetail';

export const getInventoryReceiptDetails = async () => {
    const isMock = true;
    if (isMock) {
        return inventoryReceiptDetails;
    }
    
    const endpoint = PREFIX;
    const response = await get<Response<InventoryReceiptDetail[]>>(endpoint);
    return response.data.data;
};

export const getInventoryReceiptDetailById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<InventoryReceiptDetail>>(endpoint);
    return response.data.data;
};

export const createInventoryReceiptDetail = async (body: InventoryReceiptDetail) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateInventoryReceiptDetail = async (body: InventoryReceiptDetail) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteInventoryReceiptDetail = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
