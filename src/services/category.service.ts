import { Category } from '@/utils/schemas/category.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Category';

export const getCategories = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Category[]>>(endpoint);
    return response.data.data;
};

export const getCategoryById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Category>>(endpoint);
    return response.data.data;
};

export const createCategory = async (body: Category) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateCategory = async (body: Category) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
