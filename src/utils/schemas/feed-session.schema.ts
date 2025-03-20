import { z } from 'zod';

export const FeedSessionSchema = z.object({
    feedSessionId: z.string().uuid({ message: 'ID phiên cho ăn không hợp lệ, phải là UUID' }),
    nutritionPlanId: z
        .string()
        .uuid({ message: 'ID kế hoạch dinh dưỡng không hợp lệ, phải là UUID' }),
    feedingTime: z
        .string()
        .datetime({ message: 'Thời gian cho ăn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    feedAmount: z.number().positive({ message: 'Lượng thức ăn phải là số dương' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    note: z.string().optional(),
});

export type FeedSession = z.infer<typeof FeedSessionSchema>;
export const CreateFeedSessionSchema = FeedSessionSchema.omit({ feedSessionId: true });
