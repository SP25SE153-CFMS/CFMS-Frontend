import { EvaluatedTarget } from '@/utils/schemas/evaluated-target.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/EvaluatedTarget';

export const getEvaluatedTargets = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<EvaluatedTarget[]>>(endpoint);
    return response.data.data;
};

export const getEvaluatedTargetById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<EvaluatedTarget>>(endpoint);
    return response.data.data;
};

export const createEvaluatedTarget = async (body: EvaluatedTarget) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateEvaluatedTarget = async (body: EvaluatedTarget) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteEvaluatedTarget = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
