import { CoopEquipment } from '@/utils/schemas/equipment.schema';
import { Response } from '@/utils/types';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { coopEquipments } from '@/utils/data/table.data';

const PREFIX = '/api/CoopEquipment';

export const getCoopEquipments = async () => {
    /* eslint-disable no-unused-vars */
    const endpoint = PREFIX;
    // const response = await get<Response<CoopEquipment[]>>(endpoint);
    // return response.data.data;
    return coopEquipments;
};

export const getCoopEquipmentById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<CoopEquipment>>(endpoint);
    return response.data.data;
};

export const createCoopEquipment = async (body: CoopEquipment) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateCoopEquipment = async (body: CoopEquipment) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteCoopEquipment = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
