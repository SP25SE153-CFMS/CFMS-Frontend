import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { BreedingAreaResponse } from '@/utils/types/custom.type';

const PREFIX = '/api/BreedingArea';

export const getBreedingAreas = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<BreedingAreaResponse[]>>(endpoint);
    return response.data.data;
};

export const getBreedingAreasByFarmId = async (farmId: string) => {
    const endpoint = PREFIX + '/Farm/' + farmId;
    const response = await get<Response<BreedingAreaResponse[]>>(endpoint);
    return response.data.data;
};

export const getBreedingAreaById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<BreedingAreaResponse>>(endpoint);
    return response.data.data;
};

export const createBreedingArea = async (body: BreedingArea) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateBreedingArea = async (body: BreedingArea) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteBreedingArea = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
