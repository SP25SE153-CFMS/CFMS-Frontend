import { flocks } from "@/utils/data/table.data";
import { Flock } from "@/utils/schemas/flock.schema";

export const getFlocks = async () => {
    // Mock API call
    return flocks;
};

export const getFlockById = async (id: string) => {
    // Mock API call
    return flocks.find((flock) => flock.flockId === id);
};

export const createFlock = async (flock: Flock) => {
    // Mock API call
    flocks.push(flock);
    return flock;
};

export const updateFlock = async (flock: Flock) => {
    // Mock API call
    const index = flocks.findIndex((flock) => flock.flockId === flock.flockId);
    flocks[index] = flock;
    return flock;
};

export const deleteFlock = async (id: string) => {
    // Mock API call
    const index = flocks.findIndex((flock) => flock.flockId === id);
    flocks.splice(index, 1);
    return id;
};