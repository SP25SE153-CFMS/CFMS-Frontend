import { ChickenCoop } from "@/utils/schemas/chicken-coop.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";
import { chickenCoops } from "@/utils/data/table.data";

const PREFIX = '/api/ChickenCoop';

export const getChickenCoops = async () => {
    /* eslint-disable no-unused-vars */
    const endpoint = PREFIX
    // const response = await get<Response<ChickenCoop[]>>(endpoint);
    // return response.data.data;
    return chickenCoops
};

export const getChickenCoopById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ChickenCoop>>(endpoint);
    return response.data.data;
};

export const createChickenCoop = async (body: ChickenCoop) => {
    const endpoint = PREFIX
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
}

export const updateChickenCoop = async (body: ChickenCoop) => {
    const endpoint = PREFIX
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
}

export const deleteChickenCoop = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
}