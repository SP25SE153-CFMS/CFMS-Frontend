import { Supplier } from '@/utils/schemas/supplier.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { suppliers } from '@/utils/data/table.data';

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

export const createSupplier = async (body: Supplier) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

// Tạm thời update
export const updateSupplier = async (supplier: Supplier) => {
    const index = suppliers.findIndex((supplier) => supplier.supplierId === supplier.supplierId);
    suppliers[index] = supplier;
    return supplier;
};

// export const updateSupplier = async (body: Supplier) => {
//     const endpoint = PREFIX;
//     const response = await put<Response<string>>(endpoint, body);
//     return response.data;
// };

export const deleteSupplier = async (id: string) => {
    const endpoint = `${PREFIX}/${id}`;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
