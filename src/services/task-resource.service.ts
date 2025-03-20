import { TaskResource } from '@/utils/schemas/task-resource.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/TaskResource';

export const getTaskResources = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TaskResource[]>>(endpoint);
    return response.data.data;
};

export const getTaskResourceById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TaskResource>>(endpoint);
    return response.data.data;
};

export const createTaskResource = async (body: TaskResource) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTaskResource = async (body: TaskResource) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTaskResource = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
