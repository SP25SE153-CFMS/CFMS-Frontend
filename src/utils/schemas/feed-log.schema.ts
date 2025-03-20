import { z } from 'zod';

export const FeedLogSchema = z.object({
    feedLogId: z.string().uuid({ message: 'ID nhật ký cho ăn không hợp lệ, phải là UUID' }),
    chickenBatchId: z.string().uuid({ message: 'ID lô gà không hợp lệ, phải là UUID' }),
    feedingDate: z
        .string()
        .datetime({ message: 'Ngày cho ăn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    actualFeedAmount: z.number().positive({ message: 'Lượng thức ăn thực tế phải là số dương' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    note: z.string().optional(),
});

export type FeedLog = z.infer<typeof FeedLogSchema>;
export const CreateFeedLogSchema = FeedLogSchema.omit({ feedLogId: true });
