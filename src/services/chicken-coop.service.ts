import { ChickenCoop } from "@/utils/schemas/chicken-coop.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/ChickenCoop';

export const getChickenCoops = async () => {
    const endpoint = PREFIX
    const response = await get<Response<ChickenCoop[]>>(endpoint);
    return response.data.data;
};

export const getChickenCoopById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ChickenCoop>>(endpoint);
    return response.data.data;
};

export const createChickenCoop = async (chickenCoop: ChickenCoop) => {
    const endpoint = PREFIX
    const response = await post(endpoint, chickenCoop);
    return response.data;
}

export const updateChickenCoop = async (chickenCoop: ChickenCoop) => {
    const endpoint = PREFIX
    const response = await put(endpoint, chickenCoop);
    return response.data;
}

export const deleteChickenCoop = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
}