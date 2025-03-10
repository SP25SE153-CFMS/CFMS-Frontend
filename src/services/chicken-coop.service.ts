import { chickenCoops } from "@/utils/data/table.data";
import { ChickenCoop } from "@/utils/schemas/chicken-coop.schema";

export const getChickenCoops = async () => {
    // Mock API call
    return chickenCoops;
};

export const getChickenCoopById = async (id: string) => {
    // Mock API call
    return chickenCoops.find((coop) => coop.chickenCoopId === id);
};

export const createChickenCoop = async (chickenCoop: ChickenCoop) => {
    // Mock API call
    chickenCoops.push(chickenCoop);
    return chickenCoop;
}

export const updateChickenCoop = async (chickenCoop: ChickenCoop) => {
    // Mock API call
    const index = chickenCoops.findIndex((coop) => coop.chickenCoopId === chickenCoop.chickenCoopId);
    chickenCoops[index] = chickenCoop;
    return chickenCoop;
}

export const deleteChickenCoop = async (id: string) => {
    // Mock API call
    const index = chickenCoops.findIndex((coop) => coop.chickenCoopId === id);
    chickenCoops.splice(index, 1);
    return id;
}