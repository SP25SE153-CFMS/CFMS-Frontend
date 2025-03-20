import { EvaluationResultDetail } from '@/utils/schemas/evaluation-result-detail.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/EvaluationResultDetail';

export const getEvaluationResultDetails = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<EvaluationResultDetail[]>>(endpoint);
    return response.data.data;
};

export const getEvaluationResultDetailById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<EvaluationResultDetail>>(endpoint);
    return response.data.data;
};

export const createEvaluationResultDetail = async (body: EvaluationResultDetail) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateEvaluationResultDetail = async (body: EvaluationResultDetail) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteEvaluationResultDetail = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
