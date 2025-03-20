import { Warehouse } from '@/utils/schemas/warehouse.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Warehouse';

export const getWarehouses = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Warehouse[]>>(endpoint);
    return response.data.data;
};

export const getWarehouseById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Warehouse>>(endpoint);
    return response.data.data;
};

export const createWarehouse = async (body: Warehouse) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateWarehouse = async (body: Warehouse) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteWarehouse = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
