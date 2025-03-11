import { Farm } from "@/utils/schemas/farm.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/Farm';

export const getFarms = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Farm[]>>(endpoint);
    return response.data.data;
};

export const getFarmById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Farm>>(endpoint);
    return response.data.data;
}

export const createFarm = async (farm: Farm) => {
    const endpoint = PREFIX
    const response = await post(endpoint, farm);
    return response.data;
}

export const updateFarm = async (farm: Farm) => {
    const endpoint = PREFIX
    const response = await put(endpoint, farm);
    return response.data;
}

export const deleteFarm = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
}