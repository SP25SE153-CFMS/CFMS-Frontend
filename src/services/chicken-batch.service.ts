import { ChickenBatch } from '@/utils/schemas/chicken-batch.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import {
    ChickenBatchResponse,
    SplitChickenBatch,
    StartChickenBatch,
} from '@/utils/types/custom.type';
import { QuantityLog } from '@/utils/schemas/quantity-log.schema';

const PREFIX = '/api/ChickenBatch';

export const getChickenBatches = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<ChickenBatch[]>>(endpoint);
    return response.data.data;
};

export const getChickenBatchById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ChickenBatchResponse>>(endpoint);
    return response.data.data;
};

export const createChickenBatch = async (body: ChickenBatch) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateChickenBatch = async (body: ChickenBatch) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteChickenBatch = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const getChickenBatchByCoopId = async (chickenCoopId: string) => {
    const endpoint = PREFIX + '/Coop/' + chickenCoopId;
    const response = await get<Response<ChickenBatch[]>>(endpoint);
    return response.data.data;
};

export const addQuantityLog = async (quantityLog: QuantityLog) => {
    const endpoint = PREFIX + '/add-quantitylog';
    const response = await post<Response<string>>(endpoint, quantityLog);
    return response.data;
};

// export const updateQuantityLog = async (quantityLog: QuantityLog) => {
//     const endpoint = PREFIX + '/update-quantitylog';
//     const response = await put<Response<string>>(endpoint, quantityLog);
//     return response.data;
// }

export const deleteQuantityLog = async (batchId: string, quantityLogId: string) => {
    const endpoint = PREFIX + '/delete-quantitylog/' + batchId + '/' + quantityLogId;
    const response = await remove<Response<string>>(endpoint, { batchId, quantityLogId });
    return response.data;
};

export const startChickenBatch = async (body: StartChickenBatch) => {
    const endpoint = PREFIX + '/open-chickenbatch/';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const endChickenBatch = async (chickenBatchId: string) => {
    const endpoint = PREFIX + '/close-chickenbatch/';
    const response = await put<Response<string>>(endpoint, { chickenBatchId });
    return response.data;
};

export const splitChickenBatch = async (body: SplitChickenBatch) => {
    const endpoint = PREFIX + '/split-chickenbatch/';
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};
