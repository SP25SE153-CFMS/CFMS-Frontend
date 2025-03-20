import { FarmEmployee } from '@/utils/schemas/farm-employee.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/FarmEmployee';

export const getFarmEmployees = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<FarmEmployee[]>>(endpoint);
    return response.data.data;
};

export const getFarmEmployeeById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<FarmEmployee>>(endpoint);
    return response.data.data;
};

export const createFarmEmployee = async (body: FarmEmployee) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFarmEmployee = async (body: FarmEmployee) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFarmEmployee = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
