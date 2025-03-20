import { z } from 'zod';

export const NutritionPlanSchema = z.object({
    nutritionPlanId: z
        .string()
        .uuid({ message: 'ID kế hoạch dinh dưỡng không hợp lệ, phải là UUID' }),
    name: z.string().min(1, { message: 'Tên kế hoạch là bắt buộc' }),
    description: z.string().optional(),
    target: z.string().optional(),
});

export type NutritionPlan = z.infer<typeof NutritionPlanSchema>;
export const CreateNutritionPlanSchema = NutritionPlanSchema.omit({ nutritionPlanId: true });
