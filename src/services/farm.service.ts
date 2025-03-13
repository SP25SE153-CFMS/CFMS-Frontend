import { farms } from "@/utils/data/table.data";
import { Farm } from "@/utils/schemas/farm.schema";
import { get, post } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/Farm';

export const getFarms = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Farm[]>>(endpoint);
    return response.data.data;
};

export const getFarmById = async (id: string) => {
    // Mock API call
    return farms.find((farm) => farm.farmId === id);
}

export const createFarm = async (farm: Farm) => {
    const endpoint = PREFIX
    const response = await post(endpoint, farm);
    return response.data;
}

export const updateFarm = async (farm: Farm) => {
    // Mock API call
    const index = farms.findIndex((farm) => farm.farmId === farm.farmId);
    farms[index] = farm;
    return farm;
}

export const deleteFarm = async (id: string) => {
    // Mock API call
    const index = farms.findIndex((farm) => farm.farmId === id);
    farms.splice(index, 1);
    return id;
}