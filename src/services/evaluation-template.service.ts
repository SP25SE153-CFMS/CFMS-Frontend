import { EvaluationTemplate } from '@/utils/schemas/evaluation-template.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/EvaluationTemplate';

export const getEvaluationTemplates = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<EvaluationTemplate[]>>(endpoint);
    return response.data.data;
};

export const getEvaluationTemplateById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<EvaluationTemplate>>(endpoint);
    return response.data.data;
};

export const createEvaluationTemplate = async (body: EvaluationTemplate) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateEvaluationTemplate = async (body: EvaluationTemplate) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteEvaluationTemplate = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
