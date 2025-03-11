import { Vaccine } from "@/utils/schemas/vaccine.schema";
import { get, post, put, remove } from "@/utils/functions/axios.function";
import { Response } from "@/utils/types";

const PREFIX = '/api/Vaccine';

export const getVaccines = async () => {
    const endpoint = PREFIX
    const response = await get<Response<Vaccine[]>>(endpoint);
    return response.data.data;
};

export const getVaccineById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Vaccine>>(endpoint);
    return response.data.data;
};

export const createVaccine = async (vaccine: Vaccine) => {
    const endpoint = PREFIX
    const response = await post(endpoint, vaccine);
    return response.data;
};

export const updateVaccine = async (vaccine: Vaccine) => {
    const endpoint = PREFIX
    const response = await put(endpoint, vaccine);
    return response.data;
};

export const deleteVaccine = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove(endpoint);
    return response.data;
};