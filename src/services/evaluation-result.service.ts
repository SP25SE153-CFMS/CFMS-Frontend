import { EvaluationResult } from '@/utils/schemas/evaluation-result.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/EvaluationResult';

export const getEvaluationResults = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<EvaluationResult[]>>(endpoint);
    return response.data.data;
};

export const getEvaluationResultById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<EvaluationResult>>(endpoint);
    return response.data.data;
};

export const createEvaluationResult = async (body: EvaluationResult) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateEvaluationResult = async (body: EvaluationResult) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteEvaluationResult = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
