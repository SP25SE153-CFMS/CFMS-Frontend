import { CreateEquipment, Equipment } from '@/utils/schemas/equipment.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Equipment';

export const getEquipments = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Equipment[]>>(endpoint);
    return response.data.data;
};

export const getEquipmentById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Equipment>>(endpoint);
    return response.data.data;
};

export const createEquipment = async (body: Equipment) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateEquipment = async (body: Equipment) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteEquipment = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const createEquipmentInWare = async (body: CreateEquipment) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};


