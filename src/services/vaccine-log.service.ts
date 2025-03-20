import { VaccineLog } from '@/utils/schemas/vaccine-log.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/VaccineLog';

export const getVaccineLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<VaccineLog[]>>(endpoint);
    return response.data.data;
};

export const getVaccineLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<VaccineLog>>(endpoint);
    return response.data.data;
};

export const createVaccineLog = async (body: VaccineLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateVaccineLog = async (body: VaccineLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteVaccineLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
