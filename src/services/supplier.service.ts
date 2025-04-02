import { Supplier } from '@/utils/schemas/supplier.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { ResourceItem } from '@/utils/schemas/resource-item.schema';

const PREFIX = '/api/Supplier';

interface FoodItem {
    foodCode: string;
    foodName: string;
    note: string;
    productionDate: string;
    expiryDate: string;
    unitSpecification: string;
    description: string;
    price: number;
}

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
    console.log('Api Resource: ', endpoint);
    const response = await get<Response<ResourceItem[]>>(endpoint);
    return response.data.data;
};
