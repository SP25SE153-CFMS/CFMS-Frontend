import { ResourceSupplier } from '@/utils/schemas/resource-supplier.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/ResourceSupplier';

export const getResourceSuppliers = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<ResourceSupplier[]>>(endpoint);
    return response.data.data;
};

export const getResourceSupplierById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<ResourceSupplier>>(endpoint);
    return response.data.data;
};

export const createResourceSupplier = async (body: ResourceSupplier) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateResourceSupplier = async (body: ResourceSupplier) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteResourceSupplier = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
