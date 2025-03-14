import { Response } from "@/utils/types";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { farmEmployees } from "@/utils/data/table.data";
import { FarmEmployee } from "@/utils/schemas/farm-employee.schema";

const PREFIX = '/api/FarmEmployee';

export const getFarmEmployees = async () => {
    /* eslint-disable no-unused-vars */
    const endpoint = PREFIX
    // const response = await get<Response<FarmEmployee[]>>(endpoint);
    // return response.data.data;
    return farmEmployees
};

export const getFarmEmployeeById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<FarmEmployee>>(endpoint);
    return response.data.data;
};

export const createFarmEmployee = async (body: FarmEmployee) => {
    const endpoint = PREFIX
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFarmEmployee = async (body: FarmEmployee) => {
    const endpoint = PREFIX
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFarmEmployee = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
}