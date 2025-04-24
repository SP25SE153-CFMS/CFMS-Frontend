import { Supplier } from '@/utils/schemas/supplier.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { ResourceResponse } from '@/utils/types/custom.type';
import { AddResourceSupplier } from '@/utils/schemas/resource-supplier.schema';

const PREFIX = '/api/Supplier';

export const getSuppliers = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<Supplier[]>>(endpoint);
    return response.data.data;
};

export const getSupplierById = async (id: string) => {
    const endpoint = `${PREFIX}/${id}`;
    const response = await get<Response<Supplier>>(endpoint);
    return response.data.data;
};

export const getSuppliersByFarmId = async (id: string) => {
    const endpoint = `${PREFIX}/byFarmId/${id}`;
    const response = await get<Response<Supplier[]>>(endpoint);
    return response.data.data;
};

export const createSupplier = async (body: Supplier) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateSupplier = async (body: Supplier) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteSupplier = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const getResourceSuppliersById = async (supplierId: string) => {
    const endpoint = `${PREFIX}/resource-suppliers/${supplierId}`;
    const response = await get<Response<ResourceResponse[]>>(endpoint);
    return response.data.data;
};

export const addResourceSupplier = async (body: AddResourceSupplier) => {
    const endpoint = `${PREFIX}/add-resource-supplier`;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateResourceSupplier = async (body: any) => {
    const endpoint = `${PREFIX}/update-resource-supplier`;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};
