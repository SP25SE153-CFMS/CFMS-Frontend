import { Supplier } from '@/utils/schemas/supplier.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { Food } from '@/utils/schemas/food.schema';

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

// export const createSupplier = async (body: Supplier) => {
//     const endpoint = PREFIX;
//     const response = await post<Response<string>>(endpoint, body);
//     return response.data;
// };

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

export const getResourceSuppliersByFarmIdAndSupplierId = async (
    farmId: string,
    supplierId: string,
) => {
    const endpoint = `${PREFIX}/resource-suppliers/${farmId}/${supplierId}`;
    console.log('Api Resource: ', endpoint);
    const response = await get<Response<Food[]>>(endpoint);
    return response.data.data;
};
