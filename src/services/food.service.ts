import { CreateFood, CreateFoodSchema } from './../utils/schemas/food.schema';
import { Food } from '@/utils/schemas/food.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Food';

export const getFoods = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Food[]>>(endpoint);
    return response.data.data;
};

export const getFoodById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Food>>(endpoint);
    return response.data.data;
};

export const createFood = async (body: CreateFood) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFood = async (body: Food) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFood = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
