import { RevokedToken } from '@/utils/schemas/revoked-token.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/RevokedToken';

export const getRevokedTokens = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<RevokedToken[]>>(endpoint);
    return response.data.data;
};

export const getRevokedTokenById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<RevokedToken>>(endpoint);
    return response.data.data;
};

export const createRevokedToken = async (body: RevokedToken) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateRevokedToken = async (body: RevokedToken) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteRevokedToken = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
