import { HarvestProduct } from '@/utils/schemas/harvest-product.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/HarvestProduct';

export const getHarvestProducts = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<HarvestProduct[]>>(endpoint);
    return response.data.data;
};

export const getHarvestProductById = async (id: string) => {
    const endpoint = `${PREFIX}/${id}`;
    const response = await get<Response<HarvestProduct>>(endpoint);
    return response.data.data;
};

export const createHarvestProduct = async (body: HarvestProduct) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateHarvestProduct = async (body: HarvestProduct) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteHarvestProduct = async (id: string) => {
    const endpoint = `${PREFIX}/${id}`;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
