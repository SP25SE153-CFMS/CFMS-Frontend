import { Assignment } from '@/utils/schemas/assignment.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Assignment';

export const getAssignments = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Assignment[]>>(endpoint);
    return response.data.data;
};

export const getAssignmentById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Assignment>>(endpoint);
    return response.data.data;
};

export const createAssignment = async (body: Assignment) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateAssignment = async (body: Assignment) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteAssignment = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
