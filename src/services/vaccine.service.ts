import { Vaccine } from '@/utils/schemas/vaccine.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Vaccine';

export const getVaccines = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Vaccine[]>>(endpoint);
    return response.data.data;
};

export const getVaccineById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Vaccine>>(endpoint);
    return response.data.data;
};

export const createVaccine = async (body: Vaccine) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateVaccine = async (body: Vaccine) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteVaccine = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
