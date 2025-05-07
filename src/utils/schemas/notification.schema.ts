import { z } from 'zod';

export const NotificationSchema = z.object({
    notificationId: z.string().uuid({ message: 'Thông báo không hợp lệ' }),
    notificationName: z.string().min(1, { message: 'Tên thông báo là bắt buộc' }),
    notificationType: z.string().uuid({ message: 'Loại thông báo không hợp lệ' }),
    content: z.string().optional(),
    isRead: z.boolean({ message: 'Trạng thái đọc không hợp lệ' }),
    userId: z.string().uuid({ message: 'Người dùng không hợp lệ' }),
});

export type Notification = z.infer<typeof NotificationSchema>;
