import { Farm } from '@/utils/schemas/farm.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { CreateFarmEmployee } from '@/utils/schemas/farm-employee.schema';
import {
    FarmEmployeeResponse,
    FarmResponse,
    InviteEnrollDecisionRequest,
    InviteEnrollRequest,
} from '@/utils/types/custom.type';
import { FarmRole } from '@/utils/enum';

const PREFIX = '/api/Farm';

export const getFarms = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<FarmResponse[]>>(endpoint);
    return response.data.data;
};

export const getFarmsForCurrentUser = async () => {
    const endpoint = PREFIX + '/currentUser';
    const response = await get<Response<FarmResponse[]>>(endpoint);
    return response.data.data;
};

export const getFarmById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Farm>>(endpoint);
    return response.data.data;
};

export const createFarm = async (body: Farm) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFarm = async (body: Farm) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFarm = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const getEmployeesByFarmId = async (farmId: string) => {
    const endpoint = PREFIX + '/' + farmId + '/get-employees';
    const response = await get<Response<FarmEmployeeResponse[]>>(endpoint);
    return response.data.data;
};

export const addEmployeeToFarm = async (body: CreateFarmEmployee) => {
    const endpoint = PREFIX + '/' + '/add-employee';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateEmployeeInFarm = async (body: any) => {
    const endpoint = PREFIX + '/' + '/update-employee';
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteEmployeeInFarm = async (farmEmployeeId: string) => {
    const endpoint = PREFIX + '/delete-employee';
    const response = await remove<Response<string>>(endpoint, { farmEmployeeId });
    return response.data;
};

export const inviteOrEnrollToFarm = async (body: InviteEnrollRequest) => {
    const endpoint = PREFIX + '/invite-enroll';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const enrollToFarm = async (farmCode: string) => {
    const endpoint = PREFIX + '/invite-enroll';
    const body: InviteEnrollRequest = {
        farmCode,
        methodAccess: 'enroll',
        farmRole: FarmRole.STAFF,
        employeesInvitation: [],
    };
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const rejectInvitation = async (notificationId: string) => {
    const endpoint = PREFIX + '/invite-enroll-decision';
    const body: InviteEnrollDecisionRequest = {
        notificationId,
        decision: 0,
    };
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const acceptInvitation = async (notificationId: string) => {
    const endpoint = PREFIX + '/invite-enroll-decision';
    const body: InviteEnrollDecisionRequest = {
        notificationId,
        decision: 1,
    };
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};
