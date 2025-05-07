import { z } from 'zod';

export const NutritionSchema = z.object({
    nutritionId: z.string().uuid({ message: 'Dinh dưỡng không hợp lệ' }),
    name: z.string().min(1, { message: 'Tên không được để trống' }),
    description: z.string().optional(),
    targetAudience: z.string().min(1, { message: 'Đối tượng không được để trống' }),
    developmentStage: z.string().min(1, { message: 'Giai đoạn phát triển không được để trống' }),
    foodId: z.string().uuid({ message: 'Thức ăn hợp lệ' }),
    feedScheduleId: z.string().uuid({ message: 'Lịch cho ăn không hợp lệ' }),
});

export const FeedScheduleSchema = z.object({
    feedScheduleId: z.string().uuid({ message: 'Lịch cho ăn không hợp lệ' }),
    feedTime: z.string().datetime({ message: 'Thời gian cho ăn phải là thời gian hợp lệ' }),
    feedAmount: z.coerce.number().positive({ message: 'Lượng cho ăn phải là số dương' }),
    notes: z.string().optional(),
});

export const FlockNutritionSchema = z.object({
    flockNutritionId: z.string().uuid({ message: 'Dinh dưỡng của đàn gà không hợp lệ' }),
    flockId: z.string().uuid({ message: 'Đàn gà không hợp lệ' }),
    nutritionId: z.string().uuid({ message: 'Dinh dưỡng không hợp lệ' }),
    startDate: z.string().datetime({ message: 'Ngày bắt đầu phải là thời gian hợp lệ' }),
    endDate: z.string().datetime({ message: 'Ngày kết thúc phải là thời gian hợp lệ' }),
});

export type Nutrition = z.infer<typeof NutritionSchema>;
export type FeedSchedule = z.infer<typeof FeedScheduleSchema>;
export type FlockNutrition = z.infer<typeof FlockNutritionSchema>;
