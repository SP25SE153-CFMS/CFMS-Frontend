import { ChickenBatch } from "@/utils/schemas/chicken-batch.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";
import { chickenBatches } from "@/utils/data/table.data";

const PREFIX = '/api/ChickenBatch';

export const getChickenBatches = async () => {
    /* eslint-disable no-unused-vars */
    const endpoint = PREFIX
    // const response = await get<Response<ChickenBatch[]>>(endpoint);
    // return response.data.data;
    return chickenBatches
};

export const getChickenBatchById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ChickenBatch>>(endpoint);
    return response.data.data;
};

export const createChickenBatch = async (body: ChickenBatch) => {
    const endpoint = PREFIX
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
}

export const updateChickenBatch = async (body: ChickenBatch) => {
    const endpoint = PREFIX
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
}

export const deleteChickenBatch = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
}