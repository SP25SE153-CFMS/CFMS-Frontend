import { z } from 'zod';

export const FeedLogSchema = z.object({
    feedLogId: z.string().uuid({ message: 'Nhật ký cho ăn không hợp lệ' }),
    chickenBatchId: z.string().uuid({ message: 'LỨa nuôi không hợp lệ' }),
    feedingDate: z
        .string()
        .datetime({ message: 'Ngày cho ăn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    actualFeedAmount: z.coerce
        .number()
        .positive({ message: 'Lượng thức ăn thực tế phải là số dương' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
    note: z.string().optional(),
});

export type FeedLog = z.infer<typeof FeedLogSchema>;
export const CreateFeedLogSchema = FeedLogSchema.omit({ feedLogId: true });
