import { User } from '@/utils/schemas/user.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/User';

export const getUsers = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<User[]>>(endpoint);
    return response.data.data;
};

export const getUserById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<User>>(endpoint);
    return response.data.data;
};

export const createUser = async (body: User) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateUser = async (body: User) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteUser = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const uploadAvatar = async (file: File) => {
    const endpoint = PREFIX + '/upload-image';
    const formData = new FormData();
    formData.append('File', file);
    const response = await post<Response<string>>(endpoint, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
