import { CreateTask } from '@/utils/schemas/task.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { TaskResponse } from '@/utils/types/custom.type';
const PREFIX = '/api/Task';

export const getTasks = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TaskResponse[]>>(endpoint);
    return response.data.data;
};

export const getTasksByFarmId = async (farmId: string) => {
    const endpoint = PREFIX + '/byFarmId/' + farmId;
    const response = await get<Response<TaskResponse[]>>(endpoint);
    return response.data.data;
};

export const getTaskById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TaskResponse>>(endpoint);
    return response.data.data;
};

export const createTask = async (body: CreateTask) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTask = async (body: CreateTask) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTaskStatus = async (taskId: string, status: number) => {
    const endpoint = PREFIX;
    const body = { taskId, status };
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTask = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const cancelTask = async (taskId: string) => {
    const endpoint = PREFIX + '/cancel';
    const body = { taskId };
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};
