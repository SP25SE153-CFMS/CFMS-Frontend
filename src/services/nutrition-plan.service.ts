import { NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { NutritionPlanResponse } from '@/utils/types/custom.type';
import { CreateFeedSession, FeedSession } from '@/utils/schemas/feed-session.schema';

const PREFIX = '/api/NutritionPlan';

export const getNutritionPlans = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<NutritionPlanResponse[]>>(endpoint);
    return response.data.data;
};

export const getNutritionPlanById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<NutritionPlanResponse>>(endpoint);
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

export const addFeedSession = async (body: CreateFeedSession) => {
    const endpoint = PREFIX + '/add-feedsession';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFeedSession = async (body: FeedSession) => {
    const endpoint = PREFIX + '/update-feedsession';
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFeedSession = async (feedSessionId: string, nutritionPlanId: string) => {
    const endpoint = PREFIX + '/delete-feedsession';
    const body = {
        feedSessionId,
        nutritionPlanId,
    };
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};
