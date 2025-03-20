import { WarePermission } from '@/utils/schemas/ware-permission.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/WarePermission';

export const getWarePermissions = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<WarePermission[]>>(endpoint);
    return response.data.data;
};

export const getWarePermissionById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<WarePermission>>(endpoint);
    return response.data.data;
};

export const createWarePermission = async (body: WarePermission) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateWarePermission = async (body: WarePermission) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteWarePermission = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
