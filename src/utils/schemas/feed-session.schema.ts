import { z } from 'zod';

export const FeedSessionSchema = z.object({
    feedSessionId: z.string().uuid({ message: 'Lịch cho ăn không hợp lệ' }),
    nutritionPlanId: z.string().uuid({ message: 'Chế độ dinh dưỡng không hợp lệ' }),
    // feedingTime: z
    //     .string()
    //     .datetime({ message: 'Thời gian cho ăn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    startTime: z.string().time({ message: 'Thời gian bắt đầu không hợp lệ' }),
    endTime: z.string().time({
        message: 'Thời gian kết thúc không hợp lệ',
    }),
    feedAmount: z.coerce.number().positive({ message: 'Lượng thức ăn phải là số dương' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    note: z.string().optional(),
});

export type FeedSession = z.infer<typeof FeedSessionSchema>;

export const CreateFeedSessionSchema = FeedSessionSchema.omit({ feedSessionId: true });
export type CreateFeedSession = z.infer<typeof CreateFeedSessionSchema>;

export const CreateFSWithoutNutriPlanSchema = CreateFeedSessionSchema.omit({
    nutritionPlanId: true,
});
export type CreateFSWithoutNutriPlan = z.infer<typeof CreateFSWithoutNutriPlanSchema>;
