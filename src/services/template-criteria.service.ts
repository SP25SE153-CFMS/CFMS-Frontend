import { TemplateCriteria } from '@/utils/schemas/template-criteria.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/TemplateCriteria';

export const getTemplateCriterias = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TemplateCriteria[]>>(endpoint);
    return response.data.data;
};

export const getTemplateCriteriaById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TemplateCriteria>>(endpoint);
    return response.data.data;
};

export const createTemplateCriteria = async (body: TemplateCriteria) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTemplateCriteria = async (body: TemplateCriteria) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTemplateCriteria = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
