import { Request } from "@/utils/schemas/request.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/Request';

export const getRequests = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Request[]>>(endpoint);
    return response.data.data;
};

export const getRequestById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Request>>(endpoint);
    return response.data.data;
};

export const createRequest = async (request: Request) => {
    const endpoint = PREFIX
    const response = await post(endpoint, request);
    return response.data;
};

export const updateRequest = async (request: Request) => {
    const endpoint = PREFIX
    const response = await put(endpoint, request);
    return response.data;
};

export const deleteRequest = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
}
