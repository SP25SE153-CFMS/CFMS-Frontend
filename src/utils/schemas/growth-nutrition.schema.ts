import { z } from 'zod';

export const GrowthNutritionSchema = z.object({
    growthNutritionId: z
        .string()
        .uuid({ message: 'ID dinh dưỡng tăng trưởng không hợp lệ, phải là UUID' }),
    nutritionPlanId: z
        .string()
        .uuid({ message: 'ID kế hoạch dinh dưỡng không hợp lệ, phải là UUID' }),
    growthStageId: z
        .string()
        .uuid({ message: 'ID giai đoạn tăng trưởng không hợp lệ, phải là UUID' }),
});

export type GrowthNutrition = z.infer<typeof GrowthNutritionSchema>;
export const CreateGrowthNutritionSchema = GrowthNutritionSchema.omit({ growthNutritionId: true });
