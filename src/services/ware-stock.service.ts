import { WareStock } from '@/utils/schemas/ware-stock.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/WareStock';

export const getWareStocks = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<WareStock[]>>(endpoint);
    return response.data.data;
};

export const getWareStockById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<WareStock>>(endpoint);
    return response.data.data;
};

export const createWareStock = async (body: WareStock) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateWareStock = async (body: WareStock) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteWareStock = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
