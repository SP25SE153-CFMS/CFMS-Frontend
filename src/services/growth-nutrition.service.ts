import { GrowthNutrition } from '@/utils/schemas/growth-nutrition.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/GrowthNutrition';

export const getGrowthNutritions = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<GrowthNutrition[]>>(endpoint);
    return response.data.data;
};

export const getGrowthNutritionById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<GrowthNutrition>>(endpoint);
    return response.data.data;
};

export const createGrowthNutrition = async (body: GrowthNutrition) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateGrowthNutrition = async (body: GrowthNutrition) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteGrowthNutrition = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
