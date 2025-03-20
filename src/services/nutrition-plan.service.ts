import { NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/NutritionPlan';

export const getNutritionPlans = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<NutritionPlan[]>>(endpoint);
    return response.data.data;
};

export const getNutritionPlanById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<NutritionPlan>>(endpoint);
    return response.data.data;
};

export const createNutritionPlan = async (body: NutritionPlan) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateNutritionPlan = async (body: NutritionPlan) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteNutritionPlan = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
