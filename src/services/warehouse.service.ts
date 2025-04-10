import { Warehouse } from '@/utils/schemas/warehouse.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { WareStockResponse } from '@/utils/types/custom.type';

const PREFIX = '/api/Ware';

export const getWarehouses = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Warehouse[]>>(endpoint);
    return response.data.data;
};

export const getWareById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Warehouse>>(endpoint);
    return response.data.data;
};

export const getWareByFarmId = async (id: string) => {
    const endpoint = PREFIX + '/' + 'farmId' + '/' + id;
    const response = await get<Response<WareStockResponse[]>>(endpoint);
    return response.data.data;
};

export const getWareStockByResourceTypeId = async (wareId: string, resourceTypeId: string) => {
    const endpoint = PREFIX + '/' + 'warestocks' + '/' + wareId + '/' + resourceTypeId;
    const response = await get<Response<WareStockResponse[]>>(endpoint);
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
