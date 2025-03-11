import { Flock } from "@/utils/schemas/flock.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/Flock';

export const getFlocks = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Flock[]>>(endpoint);
    return response.data.data;
};

export const getFlockById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Flock>>(endpoint);
    return response.data.data;
};

export const createFlock = async (flock: Flock) => {
    const endpoint = PREFIX
    const response = await post(endpoint, flock);
    return response.data;
};

export const updateFlock = async (flock: Flock) => {
    const endpoint = PREFIX
    const response = await put(endpoint, flock);
    return response.data;
};

export const deleteFlock = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
};