import { TaskLocation } from '@/utils/schemas/task-location.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/TaskLocation';

export const getTaskLocations = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TaskLocation[]>>(endpoint);
    return response.data.data;
};

export const getTaskLocationById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TaskLocation>>(endpoint);
    return response.data.data;
};

export const createTaskLocation = async (body: TaskLocation) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTaskLocation = async (body: TaskLocation) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTaskLocation = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
