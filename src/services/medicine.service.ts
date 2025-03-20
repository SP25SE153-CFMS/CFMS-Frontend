import { Medicine } from '@/utils/schemas/medicine.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Medicine';

export const getMedicines = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Medicine[]>>(endpoint);
    return response.data.data;
};

export const getMedicineById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Medicine>>(endpoint);
    return response.data.data;
};

export const createMedicine = async (body: Medicine) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateMedicine = async (body: Medicine) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteMedicine = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
