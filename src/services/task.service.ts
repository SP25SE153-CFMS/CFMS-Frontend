import { CreateTask, Task } from '@/utils/schemas/task.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Task';

export const getTasks = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Task[]>>(endpoint);
    return response.data.data;
};

export const getTaskById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Task>>(endpoint);
    return response.data.data;
};

export const createTask = async (body: CreateTask) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTask = async (body: Task) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTask = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
