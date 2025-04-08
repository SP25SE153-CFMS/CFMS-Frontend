import { Notification } from '@/utils/schemas/notification.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { NotificationResponse } from '@/utils/types/custom.type';

const PREFIX = '/api/Noti';

// export const getNotifications = async () => {
//     const endpoint = PREFIX;
//     const response = await get<Response<Notification[]>>(endpoint);
//     return response.data.data;
// };

export const getNotificationForCurrentUser = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<NotificationResponse[]>>(endpoint);
    return response.data.data;
};

export const getNotificationById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<Notification>>(endpoint);
    return response.data.data;
};

export const createNotification = async (body: Notification) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

// export const updateNotification = async (body: Notification) => {
//     const endpoint = PREFIX;
//     const response = await put<Response<string>>(endpoint, body);
//     return response.data;
// };

export const readOneNotification = async (notificationId: string) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, { notificationId });
    return response.data;
};

export const deleteNotification = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};
