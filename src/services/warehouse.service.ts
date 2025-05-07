import { Warehouse } from '@/utils/schemas/warehouse.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import {
    ResourceResponse,
    WarehouseResponse,
    WarestockResourceByType,
    WareStockResponse,
} from '@/utils/types/custom.type';
import { getCookie } from 'cookies-next';
import config from '@/configs';

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
    const response = await get<Response<WarehouseResponse[]>>(endpoint);
    return response.data.data;
};

export const getWareStock = async (wareId: string, resourceTypeId: string) => {
    const endpoint = `${PREFIX}/warestocks/${wareId}/${resourceTypeId}`;
    const response = await get<Response<WareStockResponse[]>>(endpoint);
    return response.data.data;
};

export const getWareStockByResourceTypeId = async (wareId: string, resourceTypeId: string) => {
    const endpoint = `${PREFIX}/warestock-depend-suppliers/${wareId}/${resourceTypeId}`;
    const response = await get<Response<WareStockResponse[]>>(endpoint);
    return response.data.data;
};

export const getWareStockByResourceId = async (resourceId: string) => {
    const endpoint = `${PREFIX}/warestock/${resourceId}`;
    // const response = await get<Response<WareStockResponse[] | ResourceResponse[]>>(endpoint);
    const response = await get<Response<ResourceResponse>>(endpoint);
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

type ResourceTypeName = 'food' | 'chicken' | 'equipment' | 'medicine' | 'harvest_product' | 'all';

export const getWarestockResourceByFarm = async (resourceTypeName: ResourceTypeName) => {
    const farmId = getCookie(config.cookies.farmId);
    const endpoint = `${PREFIX}/warestock-resource-byFarm/${resourceTypeName}/${farmId}`;
    const response = await get<Response<WarestockResourceByType[]>>(endpoint);
    return response.data.data;
};
