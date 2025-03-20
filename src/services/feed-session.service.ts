import { FeedSession } from '@/utils/schemas/feed-session.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/FeedSession';

export const getFeedSessions = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<FeedSession[]>>(endpoint);
    return response.data.data;
};

export const getFeedSessionById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<FeedSession>>(endpoint);
    return response.data.data;
};

export const createFeedSession = async (body: FeedSession) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateFeedSession = async (body: FeedSession) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteFeedSession = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
