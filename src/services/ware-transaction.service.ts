import { WareTransaction } from '@/utils/schemas/ware-transaction.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/WareTransaction';

export const getWareTransactions = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<WareTransaction[]>>(endpoint);
    return response.data.data;
};

export const getWareTransactionById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<WareTransaction>>(endpoint);
    return response.data.data;
};

export const createWareTransaction = async (body: WareTransaction) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateWareTransaction = async (body: WareTransaction) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteWareTransaction = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
