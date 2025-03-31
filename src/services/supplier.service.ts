import { Supplier } from '@/utils/schemas/supplier.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

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
    // console.log('API update: ', endpoint);
    // console.log("API update body:", JSON.stringify(body, null, 2));
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteSupplier = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    console.log('API: ', endpoint);
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
