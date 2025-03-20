import { SubCategory } from '@/utils/schemas/sub-category.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/SubCategory';

export const getSubCategories = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<SubCategory[]>>(endpoint);
    return response.data.data;
};

export const getSubCategoryById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<SubCategory>>(endpoint);
    return response.data.data;
};

export const createSubCategory = async (body: SubCategory) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateSubCategory = async (body: SubCategory) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteSubCategory = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
