import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { ChickenCoopResponse } from '@/utils/types/custom.type';
import { CoopEquipment } from '@/utils/schemas/coop-equipment.schema';

const PREFIX = '/api/ChickenCoop';

export const getChickenCoops = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<ChickenCoop[]>>(endpoint);
    return response.data.data;
};

export const getChickenCoopsByBreedingAreaId = async (breedingAreaId: string) => {
    const endpoint = PREFIX + '/BreedingArea/' + breedingAreaId;
    const response = await get<Response<ChickenCoopResponse[]>>(endpoint);
    return response.data.data;
};

export const getChickenCoopById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ChickenCoopResponse>>(endpoint);
    return response.data.data;
};

export const createChickenCoop = async (body: ChickenCoop) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateChickenCoop = async (body: ChickenCoop) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteChickenCoop = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const addCoopEquipment = async (body: CoopEquipment) => {
    const endpoint = PREFIX + '/add-coopequipment';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateCoopEquipment = async (body: CoopEquipment) => {
    const endpoint = PREFIX + '/update-coopequipment';
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteCoopEquipment = async (coopId: string, coopEquipId: string) => {
    const endpoint = PREFIX + '/delete-coopequipment';
    const response = await remove<Response<string>>(endpoint, { coopId, coopEquipId });
    return response.data;
};
