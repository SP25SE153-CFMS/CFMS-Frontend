import { FeedLog } from '@/utils/schemas/feed-log.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/FeedLog';

export const getFeedLogs = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<FeedLog[]>>(endpoint);
    return response.data.data;
};

export const getFeedLogById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<FeedLog>>(endpoint);
    return response.data.data;
};

export const createFeedLog = async (body: FeedLog) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFeedLog = async (body: FeedLog) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFeedLog = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
