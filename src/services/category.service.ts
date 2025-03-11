import { Category } from "@/utils/schemas/category.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/Category';

export const getCategories = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Category[]>>(endpoint);
    return response.data.data;
};

export const getCategoryById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Category>>(endpoint);
    return response.data.data;
};

export const createCategory = async (category: Category) => {
    const endpoint = PREFIX
    const response = await post(endpoint, category);
    return response.data;
};

export const updateCategory = async (category: Category) => {
    const endpoint = PREFIX
    const response = await put(endpoint, category);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
};