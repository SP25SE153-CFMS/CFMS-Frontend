/* eslint-disable no-unused-vars */
import { farms } from "@/utils/data/table.data";
import { get, post } from "@/utils/functions/axios.function";
import { Farm } from "@/utils/schemas/farm.schema";
import { Response } from "@/utils/types";

const PREFIX = '/farms/api/Farm';

// GET: /farms/api/Farm
export const getFarms = async () => {
    // const endpoint = PREFIX
    // const response = await get<Farm[]>(endpoint);
    // return response.data;
};

// POST: /api/Payment/CreatePayment
export const createFarm = async (data: Partial<Farm>) => {
    // const endpoint = PREFIX + '/CreateFarm';
    // const response = await post<Response<string>>(endpoint, data);
    // return response.data;
};

// PUT: /farms/api/Farm/UpdateFarm
export const updateFarm = async (data: Partial<Farm>) => {
    // const endpoint = PREFIX + '/UpdateFarm';
    // const response = await put<Response<string>>(endpoint, data);
    // return response.data;
};

// DELETE: /farms/api/Farm/DeleteFarm
export const deleteFarm = async (id: string) => {
    // const endpoint = PREFIX + '/DeleteFarm';
    // const response = await delete<Response<string>>(endpoint, { id });
    // return response.data;
};