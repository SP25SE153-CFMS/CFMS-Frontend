import { FlockNutrition } from '@/utils/schemas/nutrition.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { flockNutritions } from '@/utils/data/table.data';

const PREFIX = '/api/FlockNutrition';

export const getFlockNutritions = async () => {
    /* eslint-disable no-unused-vars */
    const endpoint = PREFIX;
    // const response = await get<Response<FlockNutrition[]>>(endpoint);
    // return response.data.data;
    return flockNutritions;
};

export const getFlockNutritionById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<FlockNutrition>>(endpoint);
    return response.data.data;
};

export const createFlockNutrition = async (body: FlockNutrition) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFlockNutrition = async (body: FlockNutrition) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFlockNutrition = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
