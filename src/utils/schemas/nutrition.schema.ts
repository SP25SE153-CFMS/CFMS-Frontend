import { z } from 'zod';

export const NutritionSchema = z.object({
    nutritionId: z.string().uuid({ message: 'nutritionId phải là UUID hợp lệ' }),
    name: z.string().min(1, { message: 'Tên không được để trống' }),
    description: z.string().optional(),
    targetAudience: z.string().min(1, { message: 'Đối tượng không được để trống' }),
    developmentStage: z.string().min(1, { message: 'Giai đoạn phát triển không được để trống' }),
    foodId: z.string().uuid({ message: 'foodId phải là UUID hợp lệ' }),
    feedScheduleId: z.string().uuid({ message: 'feedScheduleId phải là UUID hợp lệ' }),
});

export const FeedScheduleSchema = z.object({
    feedScheduleId: z.string().uuid({ message: 'feedScheduleId phải là UUID hợp lệ' }),
    feedTime: z.string().datetime({ message: 'feedTime phải là thời gian hợp lệ' }),
    feedAmount: z.number().positive({ message: 'feedAmount phải là số dương' }),
    notes: z.string().optional(),
});

export const FlockNutritionSchema = z.object({
    flockNutritionId: z.string().uuid({ message: 'flockNutritionId phải là UUID hợp lệ' }),
    flockId: z.string().uuid({ message: 'flockId phải là UUID hợp lệ' }),
    nutritionId: z.string().uuid({ message: 'nutritionId phải là UUID hợp lệ' }),
    startDate: z.string().datetime({ message: 'startDate phải là thời gian hợp lệ' }),
    endDate: z.string().datetime({ message: 'endDate phải là thời gian hợp lệ' }),
});

export type Nutrition = z.infer<typeof NutritionSchema>;
export type FeedSchedule = z.infer<typeof FeedScheduleSchema>;
export type FlockNutrition = z.infer<typeof FlockNutritionSchema>;
