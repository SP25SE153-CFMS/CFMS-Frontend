import { TaskHarvest } from '@/utils/schemas/task-harvest.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/TaskHarvest';

export const getTaskHarvests = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TaskHarvest[]>>(endpoint);
    return response.data.data;
};

export const getTaskHarvestById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TaskHarvest>>(endpoint);
    return response.data.data;
};

export const createTaskHarvest = async (body: TaskHarvest) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTaskHarvest = async (body: TaskHarvest) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTaskHarvest = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
