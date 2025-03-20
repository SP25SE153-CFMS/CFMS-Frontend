import { TaskLog } from '@/utils/schemas/task-log.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/TaskLog';

export const getTaskLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<TaskLog[]>>(endpoint);
    return response.data.data;
};

export const getTaskLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<TaskLog>>(endpoint);
    return response.data.data;
};

export const createTaskLog = async (body: TaskLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateTaskLog = async (body: TaskLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteTaskLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
