import { BreedingArea } from "@/utils/schemas/breeding-area.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/BreedingArea';

export const getBreedingAreas = async () => {
    const endpoint = PREFIX
    const response = await get<Response<BreedingArea[]>>(endpoint);
    return response.data.data;
};

export const getBreedingAreaById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<BreedingArea>>(endpoint);
    return response.data.data;
};

export const createBreedingArea = async (breedingArea: BreedingArea) => {
    const endpoint = PREFIX
    const response = await post(endpoint, breedingArea);
    return response.data;
};

export const updateBreedingArea = async (breedingArea: BreedingArea) => {
    const endpoint = PREFIX
    const response = await put(endpoint, breedingArea);
    return response.data;
};

export const deleteBreedingArea = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
};