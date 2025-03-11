import { Equipment } from "@/utils/schemas/equipment.schema";
import { Response } from "@/utils/types";
import { get, post, put, remove } from "@/utils/functions/axios.function";

const PREFIX = '/api/Equipment';

export const getEquipments = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Equipment[]>>(endpoint);
    return response.data.data;
};

export const getEquipmentById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Equipment>>(endpoint);
    return response.data.data;
};

export const createEquipment = async (equipment: Equipment) => {
    const endpoint = PREFIX
    const response = await post(endpoint, equipment);
    return response.data;
};

export const updateEquipment = async (equipment: Equipment) => {
    const endpoint = PREFIX
    const response = await put(endpoint, equipment);
    return response.data;
};

export const deleteEquipment = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
}