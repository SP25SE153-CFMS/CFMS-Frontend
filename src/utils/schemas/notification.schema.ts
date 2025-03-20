import { z } from 'zod';

export const NotificationSchema = z.object({
    notificationId: z.string().uuid({ message: 'ID thông báo không hợp lệ, phải là UUID' }),
    notificationName: z.string().min(1, { message: 'Tên thông báo là bắt buộc' }),
    notificationType: z.string().uuid({ message: 'ID loại thông báo không hợp lệ, phải là UUID' }),
    content: z.string().optional(),
    isRead: z.boolean({ message: 'Trạng thái đọc phải là giá trị boolean' }),
    userId: z.string().uuid({ message: 'ID người dùng không hợp lệ, phải là UUID' }),
});

export type Notification = z.infer<typeof NotificationSchema>;
export const CreateNotificationSchema = NotificationSchema.omit({ notificationId: true });
