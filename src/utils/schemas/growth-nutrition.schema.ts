import { z } from 'zod';

export const GrowthNutritionSchema = z.object({
    growthNutritionId: z.string().uuid({ message: 'ID dinh dưỡng tăng trưởng không hợp lệ' }),
    nutritionPlanId: z.string().uuid({ message: 'ID chế độ dinh dưỡng không hợp lệ' }),
    growthStageId: z.string().uuid({ message: 'ID giai đoạn tăng trưởng không hợp lệ' }),
});

export type GrowthNutrition = z.infer<typeof GrowthNutritionSchema>;
export const CreateGrowthNutritionSchema = GrowthNutritionSchema.omit({ growthNutritionId: true });
