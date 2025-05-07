import { CreateStockReceipt } from '@/utils/schemas/stock-receipt.schema';
import { post, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/StockReceipt';

// export const getStockReceiptById = async (id: string) => {
//     const endpoint = PREFIX + '/' + id;
//     const response = await get<Response<>>(endpoint);
//     return response.data.data;
// };

// export const getStockReceiptByFarmId = async (farmId: string) => {
//     const endpoint = PREFIX + '/Farm/' + farmId;
//     const response = await get<Response<>>(endpoint);
//     return response.data.data;
// };

export const createStockReceipt = async (body: CreateStockReceipt) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteStockReceipt = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
