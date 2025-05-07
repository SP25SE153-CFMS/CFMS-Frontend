import { VaccinationLog } from '@/utils/schemas/vaccine.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/VaccinationLog';

export const getVaccinationLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<VaccinationLog[]>>(endpoint);
    return response.data.data;
};

export const getVaccinationLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<VaccinationLog>>(endpoint);
    return response.data.data;
};

export const createVaccinationLog = async (body: VaccinationLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateVaccinationLog = async (body: VaccinationLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteVaccinationLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
