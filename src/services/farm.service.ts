import { farms } from "@/utils/data/table.data";
import { Farm } from "@/utils/schemas/farm.schema";

export const getFarms = async (): Promise<Farm[]> => {
    // Mock API call
    return farms;
};

export const getFarmById = async (id: string) => {
    // Mock API call
    return farms.find((farm) => farm.farmId === id);
}

export const createFarm = async (farm: Farm) => {
    // Mock API call
    farms.push(farm);
    return farm;
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