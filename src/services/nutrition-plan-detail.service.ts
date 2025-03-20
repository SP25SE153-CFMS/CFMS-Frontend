import { NutritionPlanDetail } from '@/utils/schemas/nutrition-plan-detail.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/NutritionPlanDetail';

export const getNutritionPlanDetails = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<NutritionPlanDetail[]>>(endpoint);
    return response.data.data;
};

export const getNutritionPlanDetailById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<NutritionPlanDetail>>(endpoint);
    return response.data.data;
};

export const createNutritionPlanDetail = async (body: NutritionPlanDetail) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateNutritionPlanDetail = async (body: NutritionPlanDetail) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteNutritionPlanDetail = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
