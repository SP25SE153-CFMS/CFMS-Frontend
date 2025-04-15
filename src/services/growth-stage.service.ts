import { GrowthStage } from '@/utils/schemas/growth-stage.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/GrowthStage';

export const getGrowthStages = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<GrowthStage[]>>(endpoint);
    return response.data.data;
};

export const getGrowthStageById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<GrowthStage>>(endpoint);
    return response.data.data;
};

export const createGrowthStage = async (body: GrowthStage) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateGrowthStage = async (body: GrowthStage) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteGrowthStage = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const addNutritionPlanToGrowthStage = async (
    growthStageId: string,
    nutritionPlanId: string,
) => {
    const endpoint = PREFIX + '/add-nutritionplan';
    const body = { growthStageId, nutritionPlanId };
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteNutritionPlanFromGrowthStage = async (
    growthStageId: string,
    nutritionPlanId: string,
) => {
    const endpoint = PREFIX + '/delete-nutritionplan';
    const body = { growthStageId, nutritionPlanId };
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};
