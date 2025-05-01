import { Request } from '@/utils/schemas/request.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { InventoryReceiptRequest, ReceiptResponse, RequestResponse } from '@/utils/types/custom.type';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { RequestStatus } from '@/utils/enum/status.enum';

const PREFIX = '/api/Request';

export const getRequests = async () => {
    const farmId = getCookie(config.cookies.farmId);
    const endpoint = `${PREFIX}/Farm/${farmId}`;
    const response = await get<Response<RequestResponse[]>>(endpoint);
    return response.data.data;
};

export const getRequestById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<RequestResponse>>(endpoint);
    return response.data.data;
};

export const createRequest = async (body: Request) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateRequest = async (body: Request) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteRequest = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const approveRequest = async (requestId: string, isApprove: RequestStatus) => {
    const endpoint = PREFIX + '/approve';
    const body = { requestId, isApprove };
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const createInvetoryReceiptFromRequest = async (body: InventoryReceiptRequest) => {
    const endpoint = PREFIX + '/create-inventory-receipt';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};


export const getReceipts = async() => {
    const endpoint = PREFIX + '/receipts';
    const response = await get<Response<ReceiptResponse[]>>(endpoint);
    return response.data.data;
}