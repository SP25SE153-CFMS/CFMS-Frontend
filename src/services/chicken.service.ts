import { Chicken } from '@/utils/schemas/chicken.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { ChickenResponse } from '@/utils/types/custom.type';

const PREFIX = '/api/Chicken';

export const getChickens = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<ChickenResponse[]>>(endpoint);
    return response.data.data;
};

export const getChickenById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Chicken>>(endpoint);
    return response.data.data;
};

export const createChicken = async (body: Chicken) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateChicken = async (body: Chicken) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteChicken = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
