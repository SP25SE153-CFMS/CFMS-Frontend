import { TaskRequest } from '@/utils/schemas/task-request.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/TaskRequest';

export const getTaskRequests = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TaskRequest[]>>(endpoint);
    return response.data.data;
};

export const getTaskRequestById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TaskRequest>>(endpoint);
    return response.data.data;
};

export const createTaskRequest = async (body: TaskRequest) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTaskRequest = async (body: TaskRequest) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTaskRequest = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
