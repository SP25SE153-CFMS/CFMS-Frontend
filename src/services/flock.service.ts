import { Flock } from "@/utils/schemas/flock.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";
import { flocks } from "@/utils/data/table.data";

const PREFIX = '/api/Flock';

export const getFlocks = async () => {
    /* eslint-disable no-unused-vars */
    const endpoint = PREFIX
    // const response = await get<Response<Flock[]>>(endpoint);
    // return response.data.data;
    return flocks;
};

export const getFlockById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Flock>>(endpoint);
    return response.data.data;
};

export const createFlock = async (body: Flock) => {
    const endpoint = PREFIX
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFlock = async (body: Flock) => {
    const endpoint = PREFIX
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFlock = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};